# YanghoScript 🚀

YanghoScript - đây là một ngôn ngữ lập trình đơn giản, hỗ trợ làm việc với biến, phép toán số học và hiển thị kết quả. Ngôn ngữ này được tạo ra dành riêng cho các Yangho Việt Nam! 😎🔥

## Đặc điểm ✨

### ✅ Tính năng hiện có:

-   Gán giá trị cho biến
-   Các phép toán số học
-   Hiển thị kết quả
-   Ghi chú (comment) dòng mã
-   Câu lệnh điều kiện
-   Hàm (Mới chỉ triển khai một phần)

### 🔜 Tính năng sắp có:

-   Vòng lặp
-   Xử lý lỗi

## Cài đặt ⚙️

### 1️⃣ Cài đặt qua NPM 📦

Bạn có thể cài đặt YanghoScript trực tiếp từ NPM:

```bash
npm install -g yanghoscript
```

Sau khi cài đặt, bạn có thể chạy YanghoScript bằng lệnh:

```bash
yanghoscript <filename>
```

Ví dụ:

```bash
yanghoscript index.ys
```

### 2️⃣ Cài đặt từ GitHub (Dành cho nhà phát triển) 🛠️

Clone repository từ GitHub:

```bash
git clone https://github.com/hoachnt/YanghoScript.git
```

Cài đặt dependencies:

```bash
cd YanghoScript
bun install
```

Chạy mã nguồn trong thư mục dự án:

```bash
bun dev examples/code.ys
```

## Cách sử dụng 💡

### 📌 Gán biến

```javascript
text = 'Hoach' IM
summ = 6 + 5 IM
```

### 🖥️ Hiển thị kết quả

```javascript
NOILIENTUC text IM
NOILIENTUC summ IM
```

### ➗ Các phép toán số học

```javascript
sumandmin = summ - 20 + 2 * 2 IM
NOILIENTUC sumandmin IM
```

### 🔀 Câu lệnh điều kiện

```javascript
NEU (2 UYTIN 1) ME
    NOILIENTUC 'Yasuo' IM
MAY KOTHI NEU (2 NHIEUHON 1) ME
    NOILIENTUC 'Kosuo' IM
MAY KOTHI ME
    NOILIENTUC 'Default' IM
MAY
```

### 🏗️ Hàm

```javascript
THE greet(name) ME
    NOILIENTUC 'Hello, ' + name IM
MAY

greet('Hoachnt') IM
```

## 📖 Từ điển từ khóa

| YanghoScript | JavaScript Equivalent |
| ------------ | --------------------- |
| `TRA`        | `return`              |
| `IM`         | `;` (kết thúc lệnh)   |
| `NOILIENTUC` | `console.log`         |
| `NEU`        | `if`                  |
| `ME`         | `{`                   |
| `MAY`        | `}`                   |
| `KOTHI`      | `else`                |
| `THE`        | `function`            |
| `UYTIN`      | `===`                 |
| `NHIEUHON`   | `>`                   |
| `ITHON`      | `<`                   |

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! 💖 Để tham gia:

1. 🔀 Fork repository trên GitHub.
2. 📥 Clone về máy.
3. 🌿 Tạo nhánh mới.
4. 💾 Commit thay đổi.
5. 🔃 Gửi pull request.

## ⚠️ Quan trọng

YanghoScript vẫn đang trong giai đoạn phát triển sơ khai và có thể còn nhiều hạn chế. Cảm ơn bạn đã quan tâm đến ngôn ngữ này! 🚀

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

Dự án này tuân theo [all-contributors](https://github.com/all-contributors/all-contributors). Mọi đóng góp đều được hoan nghênh! 🎉
