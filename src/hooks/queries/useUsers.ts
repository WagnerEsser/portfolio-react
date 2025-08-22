import { QueryKeys } from '@hooks/queries/keys';
import { UserService } from '@services/users';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useUsers = () => {
  return useQuery({
    queryKey: [QueryKeys.Users],
    queryFn: () => UserService.getUsers(),
    staleTime: 5000, // 5 seconds
    placeholderData: keepPreviousData,
  });
};
