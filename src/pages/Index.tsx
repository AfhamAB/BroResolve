import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Terminal, Shield, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Hero Section */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Zap className="w-20 h-20 text-primary glow-primary" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">
            Debug Protocol
          </h1>
          <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
            // Campus issues treated as bugs. Don't complain. Debug.
            <br />
            Your campus runs on code. Report bugs. Track fixes. Get results.
          </p>
        </div>

        {/* Portal Selection */}
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {/* Student Portal */}
          <button
            onClick={() => navigate("/student/auth")}
            className="glass-panel p-12 hover-lift group cursor-pointer text-left"
          >
            <Terminal className="w-16 h-16 mb-6 text-primary glow-primary group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
              Student Terminal
            </h2>
            <p className="text-muted-foreground font-mono mb-6">
              Report issues, track fixes, upvote bugs. Your voice, amplified.
            </p>
            <div className="flex items-center gap-2 text-primary font-mono text-sm">
              <span>Access Terminal</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>

          {/* Admin Portal */}
          <button
            onClick={() => navigate("/admin/auth")}
            className="glass-panel p-12 hover-lift group cursor-pointer text-left border-destructive/20"
          >
            <Shield className="w-16 h-16 mb-6 text-destructive glow-destructive group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-bold mb-3 group-hover:text-destructive transition-colors">
              Admin Console
            </h2>
            <p className="text-muted-foreground font-mono mb-6">
              Manage all tickets, update status, resolve issues. Elevated access.
            </p>
            <div className="flex items-center gap-2 text-destructive font-mono text-sm">
              <span>Access Console</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>
        </div>

        {/* Stats Preview */}
        <div className="glass-panel p-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold font-mono text-primary mb-2">0</div>
              <div className="text-sm text-muted-foreground font-mono">Active Issues</div>
            </div>
            <div>
              <div className="text-4xl font-bold font-mono text-success mb-2">0</div>
              <div className="text-sm text-muted-foreground font-mono">Resolved</div>
            </div>
            <div>
              <div className="text-4xl font-bold font-mono text-primary mb-2">0</div>
              <div className="text-sm text-muted-foreground font-mono">Students</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
