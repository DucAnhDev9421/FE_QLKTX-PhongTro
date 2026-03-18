export interface User {
    id: string;
    avatar?: string;
    fullName: string;
    username: string;
    email: string;
    phone: string;
    role: 'ADMIN' | 'OWNER' | 'STAFF' | 'USER';
    status: 'ACTIVE' | 'INACTIVE';
    lastLogin?: string;
    createdAt: string;
}
