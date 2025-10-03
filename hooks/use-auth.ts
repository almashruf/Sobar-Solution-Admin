import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosClient";
import { useAuthStore } from "@/lib/store";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const useCurrentUser = () => {
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const token = useAuthStore((state) => state.token);

  return useQuery<User, Error>({
    queryKey: ["currentUser", token],
    queryFn: async () => {
      const response = await api.get<{ user: User }>("/auth/me");
      const user = response.data.user;

      if (token) {
        setCredentials({ user, token });
      }

      return user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: !!token,
  });
};
