import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Terminal, Zap } from "lucide-react";

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
            BroResolve
          </h1>
          <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
            // Your issues, our priority. Let's resolve it together.
            <br />
            Track issues. Get updates. Find solutions.
          </p>
        </div>

        {/* Portal Access */}
        <div className="max-w-md mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <button
            onClick={() => navigate("/auth")}
            className="glass-panel p-12 hover-lift group cursor-pointer text-center w-full"
          >
            <Terminal className="w-16 h-16 mb-6 text-primary glow-primary group-hover:scale-110 transition-transform mx-auto" />
            <h2 className="text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
              Access Portal
            </h2>
            <p className="text-muted-foreground font-mono mb-6">
              Login to submit issues, track resolutions, and manage tickets.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary font-mono text-sm">
              <span>Get Started</span>
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
