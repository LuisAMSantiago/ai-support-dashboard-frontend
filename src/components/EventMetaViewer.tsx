import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TicketEventMeta } from '@/types';

interface EventMetaViewerProps {
  meta: TicketEventMeta;
}

export function EventMetaViewer({ meta }: EventMetaViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Filter out before/after since they're handled specially for status_changed
  const displayMeta = { ...meta };
  delete displayMeta.before;
  delete displayMeta.after;

  // Don't render if no extra meta
  if (Object.keys(displayMeta).length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown className="w-3 h-3 mr-1" />
        ) : (
          <ChevronRight className="w-3 h-3 mr-1" />
        )}
        Ver detalhes
      </Button>
      
      {isOpen && (
        <pre className="mt-2 p-2 rounded-md bg-muted/50 text-xs overflow-auto max-h-40 text-foreground">
          {JSON.stringify(displayMeta, null, 2)}
        </pre>
      )}
    </div>
  );
}
