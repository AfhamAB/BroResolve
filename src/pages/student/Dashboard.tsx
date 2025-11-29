import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CommandBar } from "@/components/CommandBar";
import { TicketCard, TicketStatus, TicketPriority, TicketCategory } from "@/components/TicketCard";
import { FloatingTerminal } from "@/components/FloatingTerminal";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Ticket {
  id: string;
  ticket_id: string;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  upvotes: number;
  created_at: string;
  mood?: string;
}

export default function StudentDashboard() {
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTickets();
  }, [user]);

  const loadTickets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const typedTickets: Ticket[] = (data || []).map((ticket) => ({
        ...ticket,
        category: ticket.category as TicketCategory,
        priority: ticket.priority as TicketPriority,
        status: ticket.status as TicketStatus,
      }));
      
      setTickets(typedTickets);
    } catch (error) {
      console.error("Error loading tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleCommandSubmit = async (text: string, mood: string) => {
    if (!user) return;

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

    const ticketCount = tickets.length + 1;
    const ticketId = `BUG-${String(ticketCount).padStart(3, "0")}`;

    try {
      const { data, error } = await supabase
        .from("tickets")
        .insert({
          ticket_id: ticketId,
          title: text,
          category,
          priority,
          status: "committed",
          mood,
          upvotes: 1,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const typedTicket: Ticket = {
        ...data,
        category: data.category as TicketCategory,
        priority: data.priority as TicketPriority,
        status: data.status as TicketStatus,
      };

      setTickets([typedTicket, ...tickets]);
      toast.success("Ticket submitted successfully");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to submit ticket");
    }
  };

  const handleUpvote = async (ticketId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    try {
      const { error } = await supabase
        .from("tickets")
        .update({ upvotes: ticket.upvotes + 1 })
        .eq("id", ticketId);

      if (error) throw error;

      setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, upvotes: t.upvotes + 1 } : t)));
    } catch (error) {
      console.error("Error upvoting ticket:", error);
      toast.error("Failed to upvote");
    }
  };

  const handleTicketClick = (id: string) => {
    console.log("Open ticket:", id);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">
                BroResolve
              </h1>
              <p className="text-muted-foreground font-mono">
                // Your issues, our priority. Let's resolve it together.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="font-mono text-primary border-primary/30">
                {tickets.length} My Issues
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => setProfileDialogOpen(true)}>
                <User className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
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
            { label: "Total", count: tickets.length, color: "text-primary" },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6 text-center">
              <div className={`text-3xl font-bold font-mono mb-2 ${stat.color}`}>{stat.count}</div>
              <div className="text-sm text-muted-foreground font-mono">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tickets Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="glass-panel p-8 text-center text-muted-foreground font-mono">
              Loading tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="glass-panel p-8 text-center text-muted-foreground font-mono">
              No tickets yet. Press Cmd+K to submit your first issue!
            </div>
          ) : (
            tickets.map((ticket, i) => (
              <div
                key={ticket.id}
                className="animate-fade-in"
                style={{ animationDelay: `${0.2 + i * 0.05}s` }}
              >
                <TicketCard
                  ticket={{
                    id: ticket.ticket_id,
                    title: ticket.title,
                    category: ticket.category,
                    priority: ticket.priority,
                    status: ticket.status,
                    upvotes: ticket.upvotes,
                    timestamp: getTimeAgo(ticket.created_at),
                    mood: ticket.mood,
                  }}
                  onUpvote={() => handleUpvote(ticket.id)}
                  onClick={handleTicketClick}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Command Bar */}
      <CommandBar open={commandBarOpen} onOpenChange={setCommandBarOpen} onSubmit={handleCommandSubmit} />

      {/* Profile Edit Dialog */}
      {user && (
        <EditProfileDialog
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
          userId={user.id}
        />
      )}

      {/* Floating Terminal Button */}
      <FloatingTerminal onClick={() => setCommandBarOpen(true)} />
    </div>
  );
}
