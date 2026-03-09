import { Room, RoomType, Floor, Building } from '../types';

export const mockBuildings: Building[] = [
    {
        buildingId: 1,
        buildingName: 'QLKTX - Cơ sở Quận 1',
        address: '123 Nguyễn Thị Minh Khai, Q1, TP.HCM',
        manager: { userId: 1, username: 'admin1', fullName: 'Nguyễn Văn A', email: 'a@qlktx.com', phoneNumber: '0901234567', role: null, isActive: true },
        totalFloors: 5
    },
    {
        buildingId: 2,
        buildingName: 'QLKTX - Cơ sở Quận 7',
        address: '456 Nguyễn Văn Linh, Q7, TP.HCM',
        manager: { userId: 2, username: 'admin2', fullName: 'Trần Thị B', email: 'b@qlktx.com', phoneNumber: '0909876543', role: null, isActive: true },
        totalFloors: 7
    }
];

export const mockFloors: Floor[] = [
    { floorId: 1, floorName: 'Tầng 1', building: mockBuildings[0] },
    { floorId: 2, floorName: 'Tầng 2', building: mockBuildings[0] },
    { floorId: 3, floorName: 'Tầng 1', building: mockBuildings[1] },
];

export const mockRoomTypes: RoomType[] = [
    { roomTypeId: 1, typeName: 'Phòng Tiêu Chuẩn', basePrice: 3500000, area: 20, maxOccupancy: 2, description: 'Phòng tiêu chuẩn đầy đủ nội thất cơ bản.' },
    { roomTypeId: 2, typeName: 'Phòng Studio', basePrice: 4500000, area: 25, maxOccupancy: 2, description: 'Phòng studio rộng rãi có bếp riêng.' },
    { roomTypeId: 3, typeName: 'Phòng VIP', basePrice: 6000000, area: 35, maxOccupancy: 4, description: 'Phòng VIP diện tích lớn, nội thất cao cấp.' },
];

export const mockRooms: Room[] = Array.from({ length: 12 }).map((_, i) => ({
    roomId: i + 1,
    roomNumber: `${i < 6 ? '1' : '2'}0${(i % 6) + 1}`,
    floor: mockFloors[i % 3], // Giả lập tầng
    roomType: mockRoomTypes[i % 3], // Phân bổ loại phòng
    currentStatus: i % 4 === 0 ? 'AVAILABLE' : (i % 5 === 0 ? 'MAINTENANCE' : 'OCCUPIED'),
}));
