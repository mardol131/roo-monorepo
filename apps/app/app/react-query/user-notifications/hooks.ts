import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { UserNotification, Where } from "@roo/common";
import { GetCollectionParams, PatchData } from "@/app/functions/api/general";
import { userNotificationKeys } from "../query-keys";
import {
  fetchUserNotifications,
  updateUserNotification,
  updateUserNotifications,
} from "./fetch";
import { useAuth } from "@/app/context/auth/auth-context";

const REFETCH_INTERVAL = 60_000;

export function useUserNotifications(
  options?: Omit<GetCollectionParams, "page"> & { refetchInterval?: number },
) {
  const { refetchInterval, ...fetchOptions } = options ?? {};
  const auth = useAuth();
  console.log(auth);
  return useInfiniteQuery({
    queryKey: userNotificationKeys.all(),
    queryFn: ({ pageParam }) =>
      fetchUserNotifications({ ...fetchOptions, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    refetchInterval: refetchInterval ?? REFETCH_INTERVAL,
    enabled: !!auth.user,
  });
}

export function useUnreadUserNotificationsCount(options?: {
  refetchInterval?: number;
}) {
  const auth = useAuth();
  return useQuery({
    queryKey: userNotificationKeys.unreadCount(),
    queryFn: () =>
      fetchUserNotifications({
        query: { seen: { not_equals: true } },
        limit: 1,
      }),
    select: (data) => data.totalDocs ?? 0,
    refetchInterval: options?.refetchInterval ?? REFETCH_INTERVAL,
    enabled: !!auth.user,
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
      queryClient.invalidateQueries({
        queryKey: userNotificationKeys.unreadCount(),
      });
    },
  });
}

export type UpdateUserNotificationsVars = {
  query: Where;
  data: PatchData<UserNotification>;
};

export function useUpdateUserNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ query, data }: UpdateUserNotificationsVars) =>
      updateUserNotifications(query, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userNotificationKeys.all() });
      queryClient.invalidateQueries({
        queryKey: userNotificationKeys.unreadCount(),
      });
    },
  });
}
