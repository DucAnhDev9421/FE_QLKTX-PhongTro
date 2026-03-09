const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

const directories = [
    'src/components/layout',
    'src/components/ui',
    'src/hooks',
    'src/pages/dashboard',
    'src/pages/rooms',
    'src/pages/students',
    'src/pages/contracts',
    'src/pages/payments',
    'src/pages/reports',
    'src/pages/settings',
    'src/services',
    'src/types',
    'src/utils'
];

directories.forEach(dir => {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

const files = {
    'src/components/layout/Sidebar.tsx': `export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <nav>
        <ul>
          <li className="mb-2"><a href="/dashboard">Dashboard</a></li>
          <li className="mb-2"><a href="/rooms">Quản lý phòng</a></li>
          <li className="mb-2"><a href="/students">Quản lý sinh viên</a></li>
          <li className="mb-2"><a href="/contracts">Quản lý hợp đồng</a></li>
          <li className="mb-2"><a href="/payments">Quản lý thanh toán</a></li>
          <li className="mb-2"><a href="/reports">Báo cáo</a></li>
          <li className="mb-2"><a href="/settings">Cài đặt</a></li>
        </ul>
      </nav>
    </aside>
  );
};
`,
    'src/components/layout/Header.tsx': `export const Header = () => {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">Hệ thống Quản lý Kí túc xá</h1>
      <div>Admin User</div>
    </header>
  );
};
`,
    'src/components/layout/index.tsx': `import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
`,
    'src/components/ui/Badge.tsx': `import React from 'react';

export const Badge = ({ children, variant = "primary" }: { children: React.ReactNode, variant?: string }) => {
  return <span className={\`px-2 py-1 rounded text-xs \${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}\`}>{children}</span>;
};
`,
    'src/components/ui/Modal.tsx': `import React from 'react';

export const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative min-w-[300px]">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">X</button>
        {children}
      </div>
    </div>
  );
};
`,
    'src/components/ui/Pagination.tsx': `import React from 'react';

export const Pagination = ({ currentPage, totalPages }: { currentPage: number, totalPages: number }) => {
  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button className="px-3 py-1 border rounded" disabled={currentPage === 1}>Prev</button>
      <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
      <button className="px-3 py-1 border rounded" disabled={currentPage === totalPages}>Next</button>
    </div>
  );
};
`,
    'src/components/ui/StatCard.tsx': `import React from 'react';

export const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon?: React.ReactNode }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow min-w-[200px] flex items-center space-x-4">
      {icon && <div className="text-3xl text-blue-500">{icon}</div>}
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};
`,
    'src/components/ui/FilterBar.tsx': `import React from 'react';

export const FilterBar = ({ onFilter }: { onFilter: (value: string) => void }) => {
  return (
    <div className="my-4 flex">
      <input 
        type="text" 
        placeholder="Tìm kiếm..." 
        className="border p-2 rounded w-full max-w-md"
        onChange={(e) => onFilter(e.target.value)}
      />
    </div>
  );
};
`,
    'src/components/ui/index.ts': `export * from './Badge';
export * from './Modal';
export * from './Pagination';
export * from './StatCard';
export * from './FilterBar';
`,
    'src/hooks/useRooms.ts': `import { useQuery } from '@tanstack/react-query';
import { roomService } from '../services';

export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomService.getRooms().then(res => res.data),
  });
};
`,
    'src/hooks/useStudents.ts': `import { useQuery } from '@tanstack/react-query';
import { studentService } from '../services';

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getStudents().then(res => res.data),
  });
};
`,
    'src/pages/dashboard/index.tsx': `import React from 'react';
import { Layout } from '../../components/layout';

export default function Dashboard() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Tổng quan & Biểu đồ</h1>
    </Layout>
  );
}
`,
    'src/pages/rooms/index.tsx': `import React from 'react';
import { Layout } from '../../components/layout';

export default function Rooms() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Quản lý phòng (Grid View)</h1>
    </Layout>
  );
}
`,
    'src/pages/students/index.tsx': `import React from 'react';
import { Layout } from '../../components/layout';

export default function Students() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Quản lý sinh viên (Table View)</h1>
    </Layout>
  );
}
`,
    'src/pages/contracts/index.tsx': `import React from 'react';
import { Layout } from '../../components/layout';

export default function Contracts() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Quản lý hợp đồng</h1>
    </Layout>
  );
}
`,
    'src/pages/payments/index.tsx': `import React from 'react';
import { Layout } from '../../components/layout';

export default function Payments() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Quản lý thanh toán</h1>
    </Layout>
  );
}
`,
    'src/pages/reports/index.tsx': `import React from 'react';
import { Layout } from '../../components/layout';

export default function Reports() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Báo cáo & Thống kê</h1>
    </Layout>
  );
}
`,
    'src/pages/settings/index.tsx': `import React from 'react';
import { Layout } from '../../components/layout';

export default function Settings() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Cài đặt hệ thống</h1>
    </Layout>
  );
}
`,
    'src/services/api.ts': `import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here
    return Promise.reject(error);
  }
);
`,
    'src/services/roomService.ts': `import { api } from './api';
import { mockRooms } from '../utils/mockData';

export const roomService = {
  getRooms: () => {
    // mock data cho dev
    return Promise.resolve({ data: mockRooms });
  }
};
`,
    'src/services/studentService.ts': `import { api } from './api';
import { mockStudents } from '../utils/mockData';

export const studentService = {
  getStudents: () => {
    // mock data cho dev
    return Promise.resolve({ data: mockStudents });
  }
};
`,
    'src/services/index.ts': `export * from './roomService';
export * from './studentService';
// export * from './contractService';
// export * from './paymentService';
`,
    'src/types/index.ts': `export interface Room {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  status: 'available' | 'full' | 'maintenance';
  price: number;
}

export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  dob: string;
  gender: 'male' | 'female';
  phone: string;
  roomId: string | null;
}
`,
    'src/utils/helpers.ts': `export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export const statusMaps: Record<string, string> = {
  available: "Còn trống",
  full: "Đã đầy",
  maintenance: "Đang bảo trì"
};
`,
    'src/utils/mockData.ts': `import { Room, Student } from '../types';

export const mockRooms: Room[] = [
  { id: '1', name: 'Phòng 101', capacity: 4, currentOccupancy: 4, status: 'full', price: 1500000 },
  { id: '2', name: 'Phòng 102', capacity: 4, currentOccupancy: 2, status: 'available', price: 1500000 },
  { id: '3', name: 'Phòng 103', capacity: 6, currentOccupancy: 0, status: 'maintenance', price: 1200000 },
];

export const mockStudents: Student[] = [
  { id: '1', studentCode: 'SV001', fullName: 'Nguyễn Văn A', dob: '2000-01-01', gender: 'male', phone: '0123456789', roomId: '1' },
  { id: '2', studentCode: 'SV002', fullName: 'Trần Thị B', dob: '2000-02-02', gender: 'female', phone: '0987654321', roomId: '1' },
];
`
};

Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(rootDir, filePath);
    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, content);
    }
});
