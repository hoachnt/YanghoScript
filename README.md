# YanghoScript - Chuyển đổi từ TypeScript sang Go

Nhánh này (rewrite-in-go) được dùng để chuyển mã nguồn YanghoScript từ TypeScript sang Go.

## Mục đích

-   Viết lại toàn bộ Lexer, Token và Parser từ TypeScript sang Go.
-   Đảm bảo tính tương đương về logic giữa hai phiên bản.
-   Tối ưu hiệu suất và cải thiện cấu trúc.
-   Loại bỏ những giới hạn của JavaScript runtime bằng việc dùng Go.

## Trạng thái

-   Lexer: Hoàn thành.
-   Token: Hoàn thành.
-   Parser: Chưa bắt đầu.

## Cách sử dụng

1. Clone repo:
    ```sh
    git clone -b rewrite-in-go https://github.com/hoach-linux/yanghoscript.git
    ```
2. Chạy lexer:
    ```sh
    go run main.go
    ```
3. Đóng góp: PRs hoặc issue luôn được chào đón!
