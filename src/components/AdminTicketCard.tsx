import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, CheckCircle2, AlertCircle, Clock, Package } from "lucide-react";
import { PipelineTracker } from "./PipelineTracker";
import { TicketStatus, TicketPriority, TicketCategory } from "./TicketCard";

interface AdminTicket {
  id: string;
  ticket_id: string;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  upvotes: number;
  created_at: string;
  mood?: string;
  student_name?: string;
  image_url?: string;
}

interface AdminTicketCardProps {
  ticket: AdminTicket;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onClick: (id: string) => void;
}

const priorityConfig = {
  low: { color: "text-muted-foreground", icon: Clock },
  medium: { color: "text-warning", icon: AlertCircle },
  high: { color: "text-destructive", icon: AlertCircle },
  critical: { color: "text-destructive pulse-urgent", icon: AlertCircle },
};

const categoryIcons = {
  infrastructure: "🔧",
  academic: "📚",
  "mental-health": "💙",
  food: "🍽️",
  hostel: "🏠",
  other: "📌",
};

const moodEmojis = {
  frustrated: "😤",
  panicking: "😰",
  neutral: "😐",
  sick: "🤒",
};

export const AdminTicketCard = ({ ticket, onStatusChange, onClick }: AdminTicketCardProps) => {
  const { color, icon: PriorityIcon } = priorityConfig[ticket.priority];

  return (
    <div className="glass-panel p-6 hover-lift cursor-pointer group" onClick={() => onClick(ticket.id)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{categoryIcons[ticket.category]}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <code className="text-primary font-mono text-sm">{ticket.ticket_id}</code>
              <Badge variant="outline" className="capitalize text-xs">
                {ticket.category.replace("-", " ")}
              </Badge>
              {ticket.mood && (
                <span className="text-lg" title={ticket.mood}>
                  {moodEmojis[ticket.mood as keyof typeof moodEmojis]}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              {ticket.title}
            </h3>
            {ticket.student_name && (
              <p className="text-sm text-muted-foreground font-mono mb-3">
                Reported by: {ticket.student_name}
              </p>
            )}

            {ticket.image_url && (
              <div className="relative overflow-hidden rounded-lg border border-primary/20 mb-3">
                <img
                  src={ticket.image_url}
                  alt="Ticket attachment"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            <PipelineTracker status={ticket.status} />
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className={`flex items-center gap-2 ${color}`}>
            <PriorityIcon className="w-4 h-4" />
            <span className="font-mono text-sm capitalize">{ticket.priority}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 font-mono"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ArrowUp className="w-4 h-4" />
            <span>{ticket.upvotes}</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <span className="text-sm text-muted-foreground font-mono">
          {new Date(ticket.created_at).toLocaleString()}
        </span>
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            value={ticket.status}
            onValueChange={(value) => onStatusChange(ticket.id, value as TicketStatus)}
          >
            <SelectTrigger className="w-[160px] font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="committed">Committed</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="patching">Patching</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
