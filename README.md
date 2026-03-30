# YanghoScript

Ngôn ngữ thử nghiệm theo **hướng hàm (functional-first)**: gán tên một lần trong scope (`CHOT`), hàm là giá trị (lambda `THE (…) ME … MAY`), literal list `[…]`, và các hàm có sẵn **PHANG** (map), **LOC** (filter), **GAP** (fold). Từ khóa viết theo kiểu **slang tiếng Việt** (chữ Latin in hoa, không dấu), kèm **alias** cho các dạng cũ / ngắn hơn.

Trình thông dịch hiện tại viết bằng **Go** (nhánh `rewrite-in-go`): lexer → parser → AST → duyệt cây. Bản **TypeScript** cũ nằm trong [`ts/`](ts/).

---

## Mục lục

1. [Ý tưởng ngôn ngữ](#1-ý-tưởng-ngôn-ngữ)
2. [Từ vựng và từ khóa](#2-từ-vựng-và-từ-khóa)
3. [Cú pháp](#3-cú-pháp)
4. [Hàm dựng sẵn cho list](#4-hàm-dựng-sẵn-cho-list)
5. [Phần chưa hỗ trợ](#5-phần-chưa-hỗ-trợ)
6. [Chạy chương trình (CLI)](#6-chạy-chương-trình-cli)
7. [Cấu trúc kho mã](#7-cấu-trúc-kho-mã)
8. [File ví dụ](#8-file-ví-dụ)
9. [Giấy phép](#9-giấy-phép)

---

## 1. Ý tưởng ngôn ngữ

- **Gán chỉ qua `CHOT`** — không dùng `=` đứng một mình làm phép gán; parser thiết kế theo một kiểu viết thống nhất.
- **Bất biến trong scope:** gán lại `CHOT` cùng tên trong cùng scope sẽ lỗi khi chạy.
- **Hàm** khai báo bằng `THE tên(tham_số) ME … MAY` hoặc lambda `THE (a, b) ME … MAY`; trả về bằng **`TRA` biểu_thức**.
- **Điều kiện:** `NEU (điều_kiện) ME … MAY` và nhánh còn lại **`THOI ME … MAY`** (hoặc `KOTHI` thay cho `THOI`).
- **Hiệu ứng phụ in ra** — **`NOILIENTUC biểu_thức IM`** (alias `KEU`).
- **Danh sách** — literal `[a, b, c]` và hàm bậc cao `PHANG`, `LOC`, `GAP`.

---

## 2. Từ vựng và từ khóa

Định danh: `[a-zA-Z_][a-zA-Z0-9_]*`. Số nguyên (`\d+`). Chuỗi trong **dấu nháy đơn** `'nội dung'` (một dòng tới dấu `'` tiếp theo, không escape phức tạp).

Chú thích: `// …` và `/* … */`.

| Vai trò | Dạng chính | Alias (cùng nghĩa) |
|---------|------------|---------------------|
| Kết thúc câu lệnh | `IM` | `DI` |
| Khối | `ME … MAY` | `MO … DONG`, hoặc `{ … }` |
| Hàm / lambda | `THE` | `HUA` |
| In (log) | `NOILIENTUC` | `KEU` |
| Trả về | `TRA` | — |
| Nếu | `NEU` | — |
| Thì / ngược lại | `THOI` | `KOTHI` |
| Gán một lần | `CHOT` | — |
| Bằng | `UYTIN` hoặc `==` | |
| Khác | `KHONGUYTIN` hoặc `!=` | |
| Lớn / nhỏ | `NHIEUHON` / `ITHON` hoặc `>` / `<` | |
| ≥ / ≤ | `NHIEUHONHOACUYTIN` / `ITHONHOACUYTIN` hoặc `>=` / `<=` | |

Vòng lặp (`VONG`, `CHO`, …) lexer vẫn nhận diện nhưng **parser chưa xử lý** — không dùng được trong chương trình.

---

## 3. Cú pháp

### Gán và biểu thức

```text
CHOT x = 10 IM
CHOT s = 'hello' IM
NOILIENTUC x + 1 IM
```

Phép tính: `+`, `-`, `*`, `/`, ngoặc. So sánh như bảng trên.

### Khối và hàm

```text
THE add(a, b) ME
    TRA a + b IM
MAY

CHOT f = THE (x) ME TRA x * 2 IM MAY IM
NOILIENTUC add(3, 4) IM
NOILIENTUC f(5) IM
```

Hàm có tên: `THE tên(…) ME thân MAY`. Lambda: `THE (tham_số) ME … MAY`. Lambda có thể là giá trị (`CHOT triple = THE(x) ME TRA x * 3 IM MAY IM`) và gọi `triple(7)`.

### Điều kiện

```text
NEU (x UYTIN 0) ME
    NOILIENTUC 'positive' IM
MAY
THOI ME
    NOILIENTUC 'non-positive' IM
MAY
```

Có thể lồng `NEU` trong nhánh `THOI` (xem [`examples/code.ys`](examples/code.ys)).

### List

```text
CHOT xs = [1, 2, 3] IM
```

Phần tử là biểu thức, cách nhau bằng dấu phẩy.

---

## 4. Hàm dựng sẵn cho list

Cả ba đều là hàm **native** với số tham số cố định; tham số thứ hai (với `GAP` là thứ ba) phải là **lambda**, không phải hàm built-in cùng tên.

| Tên | Ý nghĩa | Cách gọi |
|-----|---------|----------|
| **PHANG** | map | `PHANG(list, THE(x) ME … MAY)` — hàm **một** tham số |
| **LOC** | filter | `LOC(list, THE(x) ME … MAY)` — vị ngữ một tham số |
| **GAP** | fold | `GAP(list, giá_trị_ban_đầu, THE(acc, x) ME … MAY)` — lambda hai tham số |

Ví dụ:

```text
CHOT xs = [1, 2, 3] IM
CHOT doubled = PHANG(xs, THE(n) ME TRA n * 2 IM MAY) IM
CHOT evens = LOC(xs, THE(n) ME TRA n UYTIN 2 IM MAY) IM
CHOT sum = GAP(xs, 0, THE(a, b) ME TRA a + b IM MAY) IM
```

---

## 5. Phần chưa hỗ trợ

- Vòng lặp (`VONG`, `CHO`, …) — mới là token, chưa có AST.
- Import module, kiểu tĩnh, class, ngoại lệ kiểu truyền thống — ngoài phạm vi trình thông dịch hiện tại.

---

## 6. Chạy chương trình (CLI)

Cần dùng trình thông dịch **Go** trong thư mục **`go/`** của nhánh này. Gói **npm** `yanghoscript` cũ **không** hiểu `CHOT`, `THE`, list, `PHANG`, v.v.; lỗi **`Error at this position …`** ở token “mới” đầu tiên thường do đang chạy **sai** binary (không phải bản build từ repo).

Build và chạy:

```bash
cd go
CGO_ENABLED=0 go build -o yanghoscript ./cmd/yanghoscript
./yanghoscript run đường/dẫn/file.ys
# tương đương:
./yanghoscript đường/dẫn/file.ys
```

**Quan trọng:** sau `go build`, file chạy là **`./yanghoscript`**. Lệnh **`yanghoscript`** không có **`./`** lấy binary trên **PATH** — thường là bản npm cũ → lại lỗi `Error at this position`.

Kiểm tra phiên bản:

```bash
./yanghoscript --version
```

Kết quả mong đợi dạng **`0.2.0-go`** (xem `go/internal/version`). Nếu gọi `yanghoscript` không `./` mà số phiên bản khác — đó là binary khác.

Chạy không phụ thuộc PATH (từ thư mục gốc repo):

```bash
./scripts/run-yanghoscript examples/code.ys
```

Máy không có `gcc`, hãy dùng **`CGO_ENABLED=0`** như trên.

---

## 7. Cấu trúc kho mã

| Đường dẫn | Vai trò |
|-----------|---------|
| `go/cmd/yanghoscript` | Điểm vào CLI |
| `go/internal/cli` | Cobra, đọc `.ys` |
| `go/internal/lexer` | Token / từ khóa |
| `go/internal/parser` | Parse ra AST |
| `go/internal/ast` | Cây cú pháp |
| `go/internal/interpreter` | Thực thi + `PHANG` / `LOC` / `GAP` |
| `go/internal/version` | Chuỗi phiên bản |

Module: `github.com/hoachnt/yanghoscript` (`go/go.mod`). Cần **Go 1.23+**.

---

## 8. File ví dụ

| File | Nội dung |
|------|----------|
| [`examples/code.ys`](examples/code.ys) | Tổng quan: `CHOT`, so sánh, `NEU`/`THOI`, đệ quy, list, lambda là giá trị, cuối file có khối **alias cũ** (`HUA`/`KEU`/…) |
| [`examples/factorial.ys`](examples/factorial.ys), [`examples/fibonacci.ys`](examples/fibonacci.ys) | Đệ quy |
| [`go/input.ys`](go/input.ys) | Script ngắn để chạy thử tay |

Đoạn tối thiểu một phong cách:

```text
CHOT x = 3 IM
THE double(n) ME TRA n * 2 MAY
NOILIENTUC double(x) IM

CHOT xs = [1, 2, 3] IM
NOILIENTUC PHANG(xs, THE(a) ME TRA a + 1 IM MAY) IM
```

---

## 9. Giấy phép

Xem file [`LICENSE`](LICENSE) ở thư mục gốc repository.
