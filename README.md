# 🏢 Hệ thống Quản lý Ký túc xá & Phòng trọ (Frontend)

Ứng dụng quản lý vận hành nhà trọ, ký túc xá hiện đại với giao diện Dark Mode (OLED), hỗ trợ quản lý tòa nhà, phòng, dịch vụ, hóa đơn và nhân sự.

---

## 🚀 Công nghệ sử dụng core (Stack)

- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Ngôn ngữ**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Quản lý State & Data**: [TanStack Query (React Query) v5](https://tanstack.com/query/latest)
- **Routing**: [React Router Dom v6](https://reactrouter.com/)
- **Charts**: [Recharts](https://recharts.org/)

---

## ✨ Tính năng chính

- **Quản lý Tòa nhà & Phòng**: Theo dõi trạng thái phòng, tầng theo thời gian thực.
- **Ghi chỉ số Dịch vụ**: Chốt số Điện/Nước hàng tháng bằng giao diện nhập nhanh (Bulk Input).
- **Hóa đơn & Thanh toán**: Tự động sinh hóa đơn, quản lý công nợ và cấu hình mã chuyên khoản QR.
- **Quản lý Người dùng & Nhân viên**: Phân quyền OWNER, ADMIN, STAFF và quản lý trạng thái tài khoản.
- **Hồ sơ Cá nhân**: Tự cập nhật thông tin và đổi mật khẩu bảo mật.

---

## 🛠 Hướng dẫn Cài đặt & Setup

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18.x hoặc mới hơn.
- **NPM**: Đi kèm khi cài Node.js.

### 2. Cài đặt Dependencies
Mở terminal tại thư mục gốc của dự án và chạy lệnh:
```bash
npm install
```

### 3. Chạy môi trường Development
Để khởi chạy ứng dụng ở chế độ phát triển (Hot reload):
```bash
npm run dev
```
Sau đó truy cập: [http://localhost:5173](http://localhost:5173)

### 4. Build Production
Để đóng gói ứng dụng cho việc triển khai thực tế (Deploy):
```bash
npm run build
```
Sản phẩm sau khi build sẽ nằm trong thư mục `/dist`.

---

## 📁 Cấu trúc thư mục dự án

- `src/components/layout`: Chứa Sidebar, Header và khung Layout chung.
- `src/pages`: Toàn bộ các trang chức năng (Buildings, Invoices, Users, Profile...).
- `src/contexts`: Các bộ quản lý trạng thái toàn cục (Theme, Auth...).
- `src/types`: Định nghĩa các Interface dữ liệu (TypeScript).
- `src/assets`: Hình ảnh, font chữ và tài nguyên tĩnh.

---

## 🎨 Thiết kế giao diện
Dự án sử dụng phong cách **Modern Dark Mode** với bảng màu Slate và Emerald.
Các component được thiết kế responsive, đảm bảo hiển thị tốt trên cả Máy tính và Máy tính bảng.

---

**© 2026 Property Management System**