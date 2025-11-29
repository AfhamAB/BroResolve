import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Users, Shield, Ban, CheckCircle, Mail, Phone } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  contact_number: string | null;
  is_active: boolean;
  created_at: string;
  role: "admin" | "student";
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [actionType, setActionType] = useState<"activate" | "suspend" | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get all user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles = profiles.map((profile) => {
        const userRole = roles.find((r) => r.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || "student",
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      const newStatus = !selectedUser.is_active;
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: newStatus })
        .eq("id", selectedUser.id);

      if (error) throw error;

      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, is_active: newStatus } : u
        )
      );

      toast.success(
        newStatus
          ? `${selectedUser.email} has been activated`
          : `${selectedUser.email} has been suspended`
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    } finally {
      setSelectedUser(null);
      setActionType(null);
    }
  };

  const openConfirmDialog = (user: UserProfile, action: "activate" | "suspend") => {
    setSelectedUser(user);
    setActionType(action);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel p-8 text-center text-muted-foreground font-mono">
            Loading users...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-4 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/dashboard")}
            className="font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-muted-foreground font-mono">
                // Manage user accounts and permissions
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-primary border-primary/30">
              <Users className="w-4 h-4 mr-2" />
              {users.length} Users
            </Badge>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-panel p-6 text-center">
            <div className="text-3xl font-bold font-mono text-success mb-2">
              {users.filter((u) => u.is_active).length}
            </div>
            <div className="text-sm text-muted-foreground font-mono">Active Users</div>
          </div>
          <div className="glass-panel p-6 text-center">
            <div className="text-3xl font-bold font-mono text-destructive mb-2">
              {users.filter((u) => !u.is_active).length}
            </div>
            <div className="text-sm text-muted-foreground font-mono">Suspended</div>
          </div>
          <div className="glass-panel p-6 text-center">
            <div className="text-3xl font-bold font-mono text-primary mb-2">
              {users.filter((u) => u.role === "admin").length}
            </div>
            <div className="text-sm text-muted-foreground font-mono">Admins</div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="glass-panel p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback className="text-xl">
                      {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">
                          {user.full_name || "Unnamed User"}
                        </h3>
                        {user.role === "admin" && (
                          <Badge variant="outline" className="font-mono text-xs border-primary/30">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        <Badge
                          variant={user.is_active ? "default" : "destructive"}
                          className="font-mono text-xs"
                        >
                          {user.is_active ? "Active" : "Suspended"}
                        </Badge>
                      </div>
                      {user.bio && (
                        <p className="text-sm text-muted-foreground">{user.bio}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="font-mono">{user.email}</span>
                      </div>
                      {user.contact_number && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="font-mono">{user.contact_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {user.is_active ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openConfirmDialog(user, "suspend")}
                      className="font-mono border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openConfirmDialog(user, "activate")}
                      className="font-mono border-success/30 text-success hover:bg-success/10"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedUser && !!actionType} onOpenChange={() => {
        setSelectedUser(null);
        setActionType(null);
      }}>
        <AlertDialogContent className="glass-panel border-primary/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono">
              {actionType === "suspend" ? "Suspend User" : "Activate User"}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono">
              {actionType === "suspend"
                ? `Are you sure you want to suspend ${selectedUser?.email}? They will be logged out and unable to access the system.`
                : `Are you sure you want to activate ${selectedUser?.email}? They will regain access to the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              className={actionType === "suspend" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
