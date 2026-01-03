import { useAuth } from '@/hooks/useAuth';
import type { Ticket } from '@/types';

export function usePermissions() {
  const { user } = useAuth();
  
  const isAdmin = user?.is_admin ?? false;
  
  const canEditTicket = (ticket: Ticket) => {
    if (!user) return false;
    // Admin pode editar qualquer ticket
    if (isAdmin) return true;
    // Se created_by é null (tickets antigos), permitir edição para usuários logados
    if (ticket.created_by === null) return true;
    // Usuário pode editar apenas seus próprios tickets
    return ticket.created_by === user.id;
  };
  
  const canDeleteTicket = (ticket: Ticket) => {
    if (!user) return false;
    // Admin pode excluir qualquer ticket
    if (isAdmin) return true;
    // Se created_by é null (tickets antigos), permitir exclusão para usuários logados
    if (ticket.created_by === null) return true;
    // Usuário pode excluir apenas seus próprios tickets
    return ticket.created_by === user.id;
  };
  
  return {
    user,
    isAdmin,
    canEditTicket,
    canDeleteTicket,
  };
}
