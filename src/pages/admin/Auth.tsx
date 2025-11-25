import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Loader2 } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AdminAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && role === "admin") {
      navigate("/admin/dashboard");
    } else if (user && role === "student") {
      toast.error("Admin access required");
      navigate("/");
    }
  }, [user, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        setLoading(false);
        return;
      }

      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message || "Login failed");
        setLoading(false);
        return;
      }

      // Wait a moment for role to be fetched
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2 animate-fade-in">
          <Shield className="w-16 h-16 mx-auto text-destructive glow-destructive" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-destructive to-warning bg-clip-text text-transparent">
            Admin Console
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            // Elevated privileges. Handle with care.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="font-mono"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading} variant="destructive">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Access Console"}
          </Button>
        </form>

        <Button variant="ghost" onClick={() => navigate("/")} className="w-full font-mono">
          ← Back to Home
        </Button>
      </div>
    </div>
  );
}
