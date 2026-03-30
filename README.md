# YanghoScript

Ngôn ngữ thử nghiệm với từ khóa tiếng Việt. Trên nhánh **rewrite-in-go**, bản triển khai chính dùng **Go**: lexer → parser → AST → interpreter (duyệt cây), không có bước biên dịch riêng sang bytecode hay mã máy.

Phiên bản sớm trên **TypeScript** nằm trong thư mục [`ts/`](ts/).

## Tính năng (hiện trạng)

| Phần | Hỗ trợ |
|------|--------|
| Kiểu giá trị | số (`float64`), chuỗi trong dấu nháy đơn, biến |
| Phép toán | `+ - * /`, so sánh bằng từ khóa hoặc `== != < > <= >=` |
| Gán | `tên = biểu thức` |
| Điều kiện | `NEU … ME … MAY`, nhánh `KOTHI` (`else` / `else if`) |
| Hàm | `THE tên(tham số, …) ME … MAY`, gọi `tên(…)`, trả về `TRA` |
| In ra | `NOILIENTUC biểu_thức` (in ra stdout) |
| Kết thúc câu lệnh | `IM` (tương đương dấu chấm phẩy) |
| Ghi chú | `// …`, `/* … */` |
| Phạm vi | ngăn xếp scope, hàm lưu toàn cục |

Lexer đã có từ khóa cho vòng lặp (`VONG`, `CHO`, …) nhưng parser **chưa xử lý** — chưa thể dùng trong chương trình.

## CLI

Biên dịch và chạy từ thư mục `go/`:

```bash
cd go
CGO_ENABLED=0 go build -o yanghoscript ./cmd/yanghoscript
./yanghoscript run path/to/file.ys
```

Lệnh **`run`** đọc file `.ys`, dựng AST và thực thi.

Nếu máy không có trình biên dịch C (`gcc`), hãy đặt **`CGO_ENABLED=0`** khi `go build` / `go run`, nếu không có thể gặp lỗi `cgo: C compiler "gcc" not found`.

## Ví dụ

```text
a = 3 IM
THE greet(name) ME
    TRA name IM
MAY
NOILIENTUC greet('Hoach') IM
```

Thêm ví dụ trong [`go/input.ys`](go/input.ys).

## Cấu trúc repo (Go)

| Đường dẫn | Vai trò |
|-----------|---------|
| `go/cmd/yanghoscript` | Điểm vào chương trình |
| `go/internal/cli` | Lệnh CLI (cobra) |
| `go/internal/lexer` | Token và lexer |
| `go/internal/parser` | Parse sang AST |
| `go/internal/ast` | Nút cây và visitor |
| `go/internal/interpreter` | Thực thi |
| `go/internal/version` | Phiên bản (`0.1.0`) |

Module Go: `github.com/hoachnt/yanghoscript` (xem `go/go.mod`).

## Yêu cầu

- Go **1.23+** (xem `go/go.mod`)
