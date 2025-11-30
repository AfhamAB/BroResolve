import { Check, Eye, Wrench, GitMerge } from "lucide-react";
import { TicketStatus } from "./TicketCard";

interface PipelineTrackerProps {
  status: TicketStatus;
}

const stages = [
  { key: "committed", label: "Committed", icon: Check },
  { key: "reviewing", label: "Reviewing", icon: Eye },
  { key: "patching", label: "Patching", icon: Wrench },
  { key: "resolved", label: "Resolved", icon: GitMerge },
] as const;

export const PipelineTracker = ({ status }: PipelineTrackerProps) => {
  const currentIndex = stages.findIndex((s) => s.key === status);

  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted/30">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
        />
      </div>

      {/* Stages */}
      <div className="relative flex justify-between">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={stage.key} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? isCurrent
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.6)]"
                      : status === "resolved"
                      ? "bg-success text-success-foreground aurora-resolved"
                      : "bg-primary/80 text-primary-foreground"
                    : "bg-muted/30 text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-mono transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
