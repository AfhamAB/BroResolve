import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, Clock } from "lucide-react";
import { PipelineTracker } from "./PipelineTracker";

export type TicketStatus = "committed" | "reviewing" | "patching" | "resolved";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketCategory = "infrastructure" | "academic" | "mental-health" | "hostel" | "other";

interface Ticket {
  id: string;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  upvotes: number;
  timestamp: string;
  mood?: string;
}

interface TicketCardProps {
  ticket: Ticket;
  onUpvote: (id: string) => void;
  onClick: (id: string) => void;
}

const categoryColors: Record<TicketCategory, string> = {
  infrastructure: "text-red-400",
  academic: "text-blue-400",
  "mental-health": "text-purple-400",
  hostel: "text-yellow-400",
  other: "text-gray-400",
};

const priorityStyles: Record<TicketPriority, string> = {
  critical: "pulse-urgent border-destructive/50",
  high: "border-destructive/30",
  medium: "border-warning/30",
  low: "border-muted/30",
};

export const TicketCard = ({ ticket, onUpvote, onClick }: TicketCardProps) => {
  return (
    <div
      className={`glass-panel-hover cursor-pointer ${priorityStyles[ticket.priority]}`}
      onClick={() => onClick(ticket.id)}
    >
      <div className="p-6 space-y-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-muted-foreground">#{ticket.id}</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{ticket.title}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="font-mono">{ticket.timestamp}</span>
          </div>
        </div>

        <PipelineTracker status={ticket.status} />
      </div>
    </div>
  );
};
