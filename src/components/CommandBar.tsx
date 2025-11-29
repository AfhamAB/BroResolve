import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Terminal, Zap } from "lucide-react";

interface CommandBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (text: string, mood: string) => void;
}

const moods = [
  { emoji: "😤", label: "Frustrated", value: "frustrated" },
  { emoji: "😰", label: "Panicking", value: "panicking" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "🤒", label: "Sick", value: "sick" },
];

export const CommandBar = ({ open, onOpenChange, onSubmit }: CommandBarProps) => {
  const [input, setInput] = useState("");
  const [selectedMood, setSelectedMood] = useState("neutral");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      onSubmit(input, selectedMood);
      setInput("");
      setSelectedMood("neutral");
      setIsAnalyzing(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-primary/30 p-0 gap-0 max-w-2xl">
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-mono">BroResolve</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the issue... (e.g., 'Wifi is down in Lab 3')"
              className="bg-background/50 border-primary/30 text-lg font-mono placeholder:text-muted-foreground/50"
              autoFocus
            />
          </form>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-3 block font-mono">
              // Select your current state
            </label>
            <div className="grid grid-cols-4 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`glass-panel-hover p-4 text-center transition-all ${
                    selectedMood === mood.value
                      ? "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                      : "border-primary/10"
                  }`}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <div className="text-xs font-mono">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isAnalyzing}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono group relative overflow-hidden"
          >
            {isAnalyzing ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Terminal className="w-4 h-4 mr-2" />
                Commit Issue
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center font-mono">
            Press <kbd className="px-2 py-1 bg-muted rounded">⌘K</kbd> to toggle
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
