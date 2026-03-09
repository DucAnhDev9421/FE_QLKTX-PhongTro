import { useQuery } from '@tanstack/react-query';
import { studentService } from '../services';

export const useStudents = () => {
    return useQuery({
        queryKey: ['students'],
        queryFn: () => studentService.getStudents().then(res => res.data),
    });
};
