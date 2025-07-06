# Money Lover - Ứng dụng Quản lý Tài chính Cá nhân

Đây là một dự án ứng dụng web được xây dựng với mục đích giúp người dùng theo dõi và quản lý tài chính cá nhân một cách hiệu quả. Người dùng có thể quản lý các giao dịch thu chi, tạo ngân sách, theo dõi các khoản vay và nợ, và xem báo cáo trực quan về tình hình tài chính của mình.

## ✨ Tính năng chính

- **Quản lý Giao dịch:** Thêm, sửa, xóa các giao dịch thu nhập và chi tiêu hàng ngày.
- **Quản lý Ngân sách:** Tạo ngân sách cho các danh mục chi tiêu cụ thể để kiểm soát việc chi tiêu.
- **Quản lý Tài khoản:** Theo dõi số dư của nhiều tài khoản ngân hàng hoặc ví điện tử.
- **Theo dõi Khoản vay & Nợ:** Quản lý các khoản vay và các khoản cho vay một cách chi tiết.
- **Báo cáo & Trực quan hóa:** Cung cấp các biểu đồ (tròn, cột) để người dùng có cái nhìn tổng quan về dòng tiền.
- **Xác thực Người dùng:** Hỗ trợ đăng ký, đăng nhập để bảo mật dữ liệu.

## 🚀 Công nghệ sử dụng

- **Frontend:**
  - [**React**](https://reactjs.org/) - Thư viện JavaScript để xây dựng giao diện người dùng.
  - [**TypeScript**](https://www.typescriptlang.org/) - Giúp code chặt chẽ và dễ bảo trì hơn.
  - [**Vite**](https://vitejs.dev/) - Công cụ build frontend thế hệ mới, siêu nhanh.
- **UI & Styling:**
  - **Material-UI:** Thư viện component UI phổ biến.
  - **shadcn/ui:** Bộ sưu tập các component UI có thể tái sử dụng.
  - **Tailwind CSS:** Framework CSS utility-first để xây dựng giao diện nhanh chóng.
- **Giao tiếp API:**
  - **Axios:** HTTP client dựa trên Promise để gọi API từ backend.
- **Biểu đồ:**
  - Sử dụng các thư viện biểu đồ (ví dụ: Chart.js hoặc Recharts) để trực quan hóa dữ liệu.

## 📂 Cấu trúc thư mục

Dự án được tổ chức theo cấu trúc module hóa để dễ dàng quản lý và mở rộng.

```
src/
├── assets/         # Chứa các tài nguyên tĩnh như hình ảnh, icon
├── components/     # Các component React tái sử dụng (UI, Dialogs, Cards)
├── data/           # Dữ liệu tĩnh (ví dụ: danh sách icons)
├── lib/            # Các hàm tiện ích, cấu hình chung
├── routes/         # Các component tương ứng với từng trang (page)
├── services/       # Logic giao tiếp với API backend
├── types/          # Định nghĩa các kiểu dữ liệu TypeScript
├── main.tsx        # Điểm khởi đầu của ứng dụng
└── ...
```

## 🏁 Cài đặt và Chạy dự án

Để chạy dự án này trên máy của bạn, hãy làm theo các bước sau:

1.  **Clone repository về máy:**
    ```bash
    git clone https://github.com/huyleuit/money-lover.git
    ```

2.  **Di chuyển vào thư mục dự án:**
    ```bash
    cd money-lover
    ```

3.  **Cài đặt các dependency (sử dụng pnpm):**
    ```bash
    pnpm install
    ```

4.  **Khởi chạy development server:**
    ```bash
    pnpm dev
    ```

Sau khi chạy lệnh `pnpm dev`, mở trình duyệt và truy cập vào `http://localhost:5173` (hoặc một cổng khác do Vite chỉ định) để xem ứng dụng.