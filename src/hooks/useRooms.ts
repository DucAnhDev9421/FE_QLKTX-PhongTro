import { useQuery } from '@tanstack/react-query';
import { roomService } from '../services';

export const useRooms = () => {
    return useQuery({
        queryKey: ['rooms'],
        queryFn: () => roomService.getRooms().then(res => res.data),
    });
};
