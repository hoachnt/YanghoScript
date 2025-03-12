YanghoScript là một ngôn ngữ lập trình đơn giản với khả năng làm việc với biến, các phép toán số học và hiển thị kết quả. Được tạo ra dành cho các yangho Việt Nam😎.

## Tính năng

### Tính năng hiện có:

-   Gán giá trị cho biến
-   Các phép toán số học
-   Hiển thị kết quả
-   Ghi chú (comment) dòng mã
-   Câu lệnh điều kiện
-   Hàm (Mới chỉ triển khai một phần)

### Tính năng sắp có (Chưa sớm đâu nha):

-   Vòng lặp
-   Xử lý lỗi

## Cài đặt

Để bắt đầu với YanghoScript, bạn cần cài đặt Node.js. Tải xuống và cài đặt từ [trang web chính thức của Node.js](https://nodejs.org/).

### Cài đặt từ NPM

Bạn có thể cài đặt YanghoScript trực tiếp từ NPM:

```bash
npm install -g yanghoscript
```

Sau khi cài đặt, bạn có thể chạy YanghoScript bằng lệnh:

```bash
yanghoscript
```

### Clone từ GitHub (Dành cho người muốn đóng góp)

Nếu bạn muốn đóng góp hoặc khám phá mã nguồn, hãy clone repository:

```bash
git clone https://github.com/hoachnt/YanghoScript.git
```

Sau đó cài đặt các dependencies:

```bash
cd YanghoScript
bun install
```

## Cách sử dụng

Sau khi cài đặt, bạn có thể sử dụng YanghoScript để chạy các chương trình được viết bằng ngôn ngữ này. Mở file `code.ys` và viết mã YanghoScript vào đó.

### Chạy một tập tin YanghoScript

Để thực thi một tập tin YanghoScript, sử dụng lệnh sau:

```bash
yanghoscript <filename>
```

Ví dụ:

```bash
yanghoscript index.ys
```

### Gán biến

```javascript
text = 'Hoach' IM
summ = 6 + 5 IM
```

### Hiển thị kết quả

```javascript
NOILIENTUC text IM
NOILIENTUC summ IM
```

### Phép toán số học

```javascript
sumandmin = summ - 20 + 2 * 2 IM
NOILIENTUC sumandmin IM
NOILIENTUC 8 + 2 * 10 IM // Kết quả mong đợi: 28
```

### So sánh

```javascript
NOILIENTUC 1 UYTIN 1 IM
NOILIENTUC 2 NHIEUHON 1 IM
NOILIENTUC 1 ITHON 2 IM
NOILIENTUC 1 NHIEUBANG 1 IM
NOILIENTUC 2 ITBANG 2 IM
```

### Câu lệnh điều kiện

```javascript
NEU (2 UYTIN 1) ME
    NOILIENTUC 'Yasuo' IM
MAY KOTHI NEU (2 NHIEUHON 1) ME
    NOILIENTUC 'Kosuo' IM
MAY KOTHI ME
    NOILIENTUC 'Default' IM
MAY
```

### Hàm

```javascript
// Tạo một hàm
THE greet(name) ME
    NOILIENTUC 'Hello, ' + name IM
MAY

// Gọi một hàm
greet('Hoachnt') IM


THE cong(a, b) ME
    TRA a + b IM
MAY

NOILIENTUC cong(1, 2) IM // Kết quả mong muốn: 3


// Đệ quy
number = 5 IM

THE recursion(n) ME
    NEU (n ITHON 1) ME
        TRA 1 IM
    MAY KOTHI ME
        NOILIENTUC n IM

        TRA recursion(n - 1) IM
    MAY
MAY


recursion(number) IM
```

### Ghi chú (Comment)

```javascript
// NOILIENTUC 'Hello world' - comment
```

Để chạy chương trình, sử dụng lệnh sau trong terminal:

```bash
bun dev examples/code.ys
```

Hãy đảm bảo rằng mã của bạn được viết trong file `code.ys`.

## Cấu trúc mã

YanghoScript hỗ trợ các cấu trúc sau:

-   Gán giá trị cho biến: `variable = value IM`
-   Phép toán số học: `+, -, *, /`

### Hỗ trợ VSCode

Bạn có thể tải xuống plugin **YanghoScript** từ **VSCode Extensions** để có tính năng đánh dấu cú pháp và hỗ trợ lập trình tốt hơn.

## Từ điển từ khóa

| YanghoScript | Tương đương trong JavaScript |
| ------------ | ---------------------------- |
| `TRA`        | `return`                     |
| `IM`         | `;` (kết thúc câu lệnh)      |
| `NOILIENTUC` | `console.log`                |
| `NEU`        | `if`                         |
| `ME`         | `{`                          |
| `MAY`        | `}`                          |
| `KOTHI`      | `else`                       |
| `THE`        | `function`                   |
| `UYTIN`      | `===`                        |
| `NHIEUHON`   | `>`                          |
| `ITHON`      | `<`                          |
| `NHIEUBANG`  | `>=`                         |
| `ITBANG`     | `<=`                         |

## Đóng góp

Đóng góp luôn được hoan nghênh! Nếu bạn muốn đóng góp:

1. Fork repository trên GitHub.
2. Clone về máy của bạn.
3. Tạo một nhánh mới.
4. Thực hiện thay đổi và commit.
5. Gửi pull request.

Nếu bạn phát hiện lỗi hoặc có đề xuất cải tiến, hãy báo cáo trong phần Issues trên GitHub.

## Quan trọng

YanghoScript đang ở giai đoạn phát triển ban đầu và có thể có một số hạn chế. Đừng quên rằng YanghoScript là một ngôn ngữ lập trình mang tính giải trí.

## Những người đóng góp ✨

Cảm ơn những người tuyệt vời sau đây:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://hoachnt.com/"><img src="https://avatars.githubusercontent.com/u/91771575?v=4?s=100" width="100px;" alt="Nguyen Tien Hoach"/><br /><sub><b>Nguyen Tien Hoach</b></sub></a><br /><a href="https://github.com/hoachnt/YanghoScript/commits?author=hoachnt" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

Dự án này tuân theo [all-contributors](https://github.com/all-contributors/all-contributors). Mọi đóng góp đều được hoan nghênh!
