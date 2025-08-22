import { QueryKeys } from '@hooks/queries/keys';
import { UserService } from '@services/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Users] });
    },
  });
};
