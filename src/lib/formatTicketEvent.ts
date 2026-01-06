import type { TicketEventType, TicketEventMeta } from '@/types';
import {
  Plus,
  Edit,
  CheckCircle2,
  RotateCcw,
  Trash2,
  Undo2,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';

export interface FormattedEvent {
  label: string;
  icon: LucideIcon;
  isAi: boolean;
  colorClass: string;
  details?: string;
}

const statusLabels: Record<string, string> = {
  open: 'Aberto',
  in_progress: 'Em Progresso',
  waiting: 'Aguardando',
  resolved: 'Resolvido',
  closed: 'Fechado',
};

export function formatTicketEvent(
  type: TicketEventType,
  meta: TicketEventMeta | null
): FormattedEvent {
  switch (type) {
    case 'created':
      return {
        label: 'Ticket criado',
        icon: Plus,
        isAi: false,
        colorClass: 'bg-green-500/10 text-green-500 border-green-500/30',
      };

    case 'updated':
      return {
        label: 'Ticket atualizado',
        icon: Edit,
        isAi: false,
        colorClass: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      };

    case 'status_changed': {
      const before = meta?.before ? statusLabels[meta.before] || meta.before : '?';
      const after = meta?.after ? statusLabels[meta.after] || meta.after : '?';
      const isClosed = meta?.after === 'closed';
      const isReopened = meta?.before === 'closed' && meta?.after !== 'closed';

      return {
        label: 'Status alterado',
        icon: isClosed ? CheckCircle2 : isReopened ? RotateCcw : Edit,
        isAi: false,
        colorClass: isClosed
          ? 'bg-gray-500/10 text-gray-500 border-gray-500/30'
          : isReopened
          ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
          : 'bg-blue-500/10 text-blue-500 border-blue-500/30',
        details: `${before} → ${after}`,
      };
    }

    case 'deleted':
      return {
        label: 'Ticket excluído',
        icon: Trash2,
        isAi: false,
        colorClass: 'bg-red-500/10 text-red-500 border-red-500/30',
      };

    case 'restored':
      return {
        label: 'Ticket restaurado',
        icon: Undo2,
        isAi: false,
        colorClass: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
      };

    case 'ai_summary_done':
      return {
        label: 'AI: resumo gerado',
        icon: Sparkles,
        isAi: true,
        colorClass: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
      };

    case 'ai_reply_done':
      return {
        label: 'AI: sugestão de resposta gerada',
        icon: MessageSquare,
        isAi: true,
        colorClass: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
      };

    case 'ai_priority_done':
      return {
        label: 'AI: prioridade classificada',
        icon: AlertTriangle,
        isAi: true,
        colorClass: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
      };

    default:
      return {
        label: 'Evento',
        icon: Edit,
        isAi: false,
        colorClass: 'bg-muted text-muted-foreground border-border',
      };
  }
}
