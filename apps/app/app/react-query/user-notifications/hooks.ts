import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserNotification } from "@roo/common";
import { PatchData } from "@/app/functions/api/general";
import { userNotificationKeys } from "../query-keys";
import { fetchUserNotifications, updateUserNotification } from "./fetch";

export function useUserNotifications(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: userNotificationKeys.all(),
    queryFn: fetchUserNotifications,
    refetchInterval: options?.refetchInterval,
  });
}

export type UpdateUserNotificationVars = {
  id: string;
  data: PatchData<UserNotification>;
};

export function useUpdateUserNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateUserNotificationVars) =>
      updateUserNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userNotificationKeys.all() });
    },
  });
}
