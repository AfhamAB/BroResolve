import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingTerminalProps {
  onClick: () => void;
}

export const FloatingTerminal = ({ onClick }: FloatingTerminalProps) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_60px_hsl(var(--primary)/0.7)] transition-all duration-300 hover:scale-110"
    >
      <Terminal className="w-6 h-6" />
    </Button>
  );
};
