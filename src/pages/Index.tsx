import { useState } from "react";
import { CommandBar } from "@/components/CommandBar";
import { TicketCard, TicketStatus, TicketPriority, TicketCategory } from "@/components/TicketCard";
import { FloatingTerminal } from "@/components/FloatingTerminal";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

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

const Index = () => {
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "BUG-001",
      title: "Wifi connection dropping in Lab 3",
      category: "infrastructure",
      priority: "critical",
      status: "reviewing",
      upvotes: 42,
      timestamp: "2h ago",
      mood: "frustrated",
    },
    {
      id: "BUG-002",
      title: "AC not working in Classroom B",
      category: "infrastructure",
      priority: "high",
      status: "patching",
      upvotes: 28,
      timestamp: "4h ago",
      mood: "neutral",
    },
    {
      id: "BUG-003",
      title: "Missing lecture notes for DSA module",
      category: "academic",
      priority: "medium",
      status: "committed",
      upvotes: 15,
      timestamp: "1d ago",
      mood: "neutral",
    },
    {
      id: "BUG-004",
      title: "Counseling session request",
      category: "mental-health",
      priority: "high",
      status: "merged",
      upvotes: 8,
      timestamp: "2d ago",
      mood: "panicking",
    },
  ]);

  const handleCommandSubmit = (text: string, mood: string) => {
    // Simple category detection
    let category: TicketCategory = "other";
    let priority: TicketPriority = "medium";

    if (text.toLowerCase().includes("wifi") || text.toLowerCase().includes("ac") || text.toLowerCase().includes("lab")) {
      category = "infrastructure";
      priority = "high";
    } else if (text.toLowerCase().includes("notes") || text.toLowerCase().includes("lecture")) {
      category = "academic";
    } else if (text.toLowerCase().includes("counseling") || text.toLowerCase().includes("mental")) {
      category = "mental-health";
      priority = "high";
    }

    if (mood === "panicking") {
      priority = "critical";
    }

    const newTicket: Ticket = {
      id: `BUG-${String(tickets.length + 1).padStart(3, "0")}`,
      title: text,
      category,
      priority,
      status: "committed",
      upvotes: 1,
      timestamp: "just now",
      mood,
    };

    setTickets([newTicket, ...tickets]);
  };

  const handleUpvote = (id: string) => {
    setTickets(tickets.map((t) => (t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t)));
  };

  const handleTicketClick = (id: string) => {
    console.log("Open ticket:", id);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">
                Debug Protocol
              </h1>
              <p className="text-muted-foreground font-mono">
                // Campus issues treated as bugs. Don't complain. Debug.
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-primary border-primary/30">
              {tickets.length} Active Issues
            </Badge>
          </div>

          {/* Search Bar */}
          <div className="glass-panel p-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 font-mono"
            />
            <button className="glass-panel-hover p-2 border-primary/20">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {[
            { label: "Critical", count: tickets.filter((t) => t.priority === "critical").length, color: "text-destructive" },
            { label: "In Progress", count: tickets.filter((t) => t.status !== "merged").length, color: "text-warning" },
            { label: "Resolved", count: tickets.filter((t) => t.status === "merged").length, color: "text-success" },
            { label: "Avg. Resolution", value: "3.2h", color: "text-primary" },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6 text-center">
              <div className={`text-3xl font-bold font-mono mb-2 ${stat.color}`}>
                {stat.count !== undefined ? stat.count : stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-mono">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tickets Grid */}
        <div className="space-y-4">
          {tickets.map((ticket, i) => (
            <div
              key={ticket.id}
              className="animate-fade-in"
              style={{ animationDelay: `${0.2 + i * 0.05}s` }}
            >
              <TicketCard ticket={ticket} onUpvote={handleUpvote} onClick={handleTicketClick} />
            </div>
          ))}
        </div>
      </div>

      {/* Command Bar */}
      <CommandBar open={commandBarOpen} onOpenChange={setCommandBarOpen} onSubmit={handleCommandSubmit} />

      {/* Floating Terminal Button */}
      <FloatingTerminal onClick={() => setCommandBarOpen(true)} />
    </div>
  );
};

export default Index;
