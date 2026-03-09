export const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
            <nav>
                <ul>
                    <li className="mb-2"><a href="/dashboard">Dashboard</a></li>
                    <li className="mb-2"><a href="/rooms">Quản lý phòng</a></li>
                    <li className="mb-2"><a href="/tenants">Quản lý người thuê</a></li>
                    <li className="mb-2"><a href="/contracts">Quản lý hợp đồng</a></li>
                    <li className="mb-2"><a href="/payments">Quản lý thanh toán</a></li>
                    <li className="mb-2"><a href="/reports">Báo cáo</a></li>
                    <li className="mb-2"><a href="/settings">Cài đặt</a></li>
                </ul>
            </nav>
        </aside>
    );
};
