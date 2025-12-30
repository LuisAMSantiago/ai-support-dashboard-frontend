import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import type { LoginCredentials, User } from '@/types';
import { toast } from 'sonner';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const meQuery = useQuery<User, Error>({
    queryKey: ['auth', 'me'],
    queryFn: authService.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (user) => {
      // Atualizar dados do usuário no cache
      queryClient.setQueryData(['auth', 'me'], user);
      // Invalidar queries de tickets para carregar com novo contexto
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Login realizado com sucesso!');
      navigate('/tickets');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao realizar login';
      toast.error(message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Limpar todo o cache, incluindo dados do usuário
      queryClient.clear();
      toast.success('Logout realizado com sucesso!');
      navigate('/login', { replace: true });
    },
    onError: () => {
      // Even on error, clear the cache and redirect
      queryClient.clear();
      toast.error('Erro ao fazer logout, mas a sessão foi encerrada');
      navigate('/login', { replace: true });
    },
  });

  return {
    user: meQuery.data,
    isLoading: meQuery.isLoading,
    isAuthenticated: !!meQuery.data,
    isError: meQuery.isError,
    authError: meQuery.error?.message,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};

export const useRequireAuth = () => {
  const { isAuthenticated, isLoading, isError } = useAuth();
  const navigate = useNavigate();

  if (!isLoading && (isError || !isAuthenticated)) {
    navigate('/login', { replace: true });
  }

  return { isAuthenticated, isLoading };
};
