import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminTicketCard } from "@/components/AdminTicketCard";
import { TicketStatus, TicketPriority, TicketCategory } from "@/components/TicketCard";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Filter, LogOut, Shield, UserPlus, Users, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [addAdminEmail, setAddAdminEmail] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const { data: ticketsData, error } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profile names separately
      const userIds = [...new Set(ticketsData.map((t) => t.created_by).filter(Boolean))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      const profilesMap = new Map(profilesData?.map((p) => [p.id, p.full_name]) || []);

      const ticketsWithNames: AdminTicket[] = ticketsData.map((ticket) => ({
        id: ticket.id,
        ticket_id: ticket.ticket_id,
        title: ticket.title,
        category: ticket.category as TicketCategory,
        priority: ticket.priority as TicketPriority,
        status: ticket.status as TicketStatus,
        upvotes: ticket.upvotes,
        created_at: ticket.created_at,
        mood: ticket.mood || undefined,
        student_name: profilesMap.get(ticket.created_by) || "Unknown Student",
      }));

      setTickets(ticketsWithNames);
    } catch (error) {
      console.error("Error loading tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      const { error } = await supabase
        .from("tickets")
        .update({ status: newStatus })
        .eq("id", ticketId);

      if (error) throw error;

      setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)));
      toast.success("Status updated");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleTicketClick = (id: string) => {
    console.log("Open ticket details:", id);
  };

  const handleAddAdmin = async () => {
    if (!addAdminEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setAddingAdmin(true);

    try {
      const { data, error } = await supabase.functions.invoke('add-admin', {
        body: { email: addAdminEmail.trim() }
      });

      if (error) {
        console.error("Error adding admin:", error);
        toast.error(error.message || "Failed to add admin");
        setAddingAdmin(false);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setAddingAdmin(false);
        return;
      }

      toast.success(data.message || "Admin added successfully");
      setAddAdminEmail("");
      setDialogOpen(false);
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error("Failed to add admin");
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-destructive glow-destructive" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-destructive to-warning bg-clip-text text-transparent">
                  Admin Console
                </h1>
              </div>
              <p className="text-muted-foreground font-mono">
                // Elevated access. All tickets. Handle with care.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="font-mono text-destructive border-destructive/30">
                {tickets.length} Total Issues
              </Badge>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/admin/users")}
                className="border-primary/30"
              >
                <Users className="w-5 h-5" />
              </Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="border-primary/30">
                    <UserPlus className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-panel border-primary/20">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Add New Admin</DialogTitle>
                    <DialogDescription className="font-mono text-muted-foreground">
                      Enter the email address of the user you want to promote to admin.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email Address</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="user@example.com"
                        value={addAdminEmail}
                        onChange={(e) => setAddAdminEmail(e.target.value)}
                        className="font-mono"
                        disabled={addingAdmin}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      disabled={addingAdmin}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddAdmin}
                      disabled={addingAdmin}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {addingAdmin ? "Adding..." : "Add Admin"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

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
              placeholder="Search all tickets..."
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
              No tickets submitted yet.
            </div>
          ) : (
            tickets.map((ticket, i) => (
              <div
                key={ticket.id}
                className="animate-fade-in"
                style={{ animationDelay: `${0.2 + i * 0.05}s` }}
              >
                <AdminTicketCard
                  ticket={ticket}
                  onStatusChange={handleStatusChange}
                  onClick={handleTicketClick}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Profile Edit Dialog */}
      {user && (
        <EditProfileDialog
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
          userId={user.id}
        />
      )}
    </div>
  );
}
