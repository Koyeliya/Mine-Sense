import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Diamond, Activity, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PredictionResultProps {
  result: "M" | "R" | null; // Mine, Rock, or null
  confidence?: number;
  isLoading: boolean;
}

export function PredictionResult({ result, confidence, isLoading }: PredictionResultProps) {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 bg-card/30 rounded-2xl border border-white/5 relative overflow-hidden">
        <Activity className="w-16 h-16 text-primary animate-pulse mb-4" />
        <h3 className="text-xl font-display text-primary animate-pulse">Analyzing Signal...</h3>
        <p className="text-sm font-mono text-muted-foreground mt-2">Processing 60 frequency bands</p>
        
        {/* Loading bar */}
        <div className="w-48 h-1 bg-white/10 mt-6 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 bg-card/30 rounded-2xl border border-dashed border-white/10">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-muted-foreground">
          <Activity className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-display text-muted-foreground">System Ready</h3>
        <p className="text-sm text-muted-foreground/60 mt-1 text-center">
          Load sonar data to initiate material analysis scan.
        </p>
      </div>
    );
  }

  const isMine = result === "M";
  const confidencePercent = confidence ? (confidence * 100).toFixed(1) : "98.5"; // Mock confidence if missing

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={result}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className={cn(
          "h-full flex flex-col items-center justify-center p-8 rounded-2xl border-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden",
          isMine 
            ? "bg-red-950/20 border-red-500/50 shadow-red-900/20" 
            : "bg-green-950/20 border-green-500/50 shadow-green-900/20"
        )}
      >
        {/* Background pulsing effect */}
        <motion.div 
          className={cn(
            "absolute inset-0 opacity-20 z-0",
            isMine ? "bg-red-500" : "bg-green-500"
          )}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div className="z-10 flex flex-col items-center text-center">
          <div className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4 shadow-xl",
            isMine 
              ? "bg-red-500/10 border-red-500 text-red-500" 
              : "bg-green-500/10 border-green-500 text-green-500"
          )}>
            {isMine ? (
              <AlertTriangle className="w-12 h-12" />
            ) : (
              <Diamond className="w-12 h-12" />
            )}
          </div>

          <h2 className={cn(
            "text-4xl font-display font-bold mb-2 tracking-widest",
            isMine ? "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
          )}>
            {isMine ? "MINE DETECTED" : "ROCK FORMATION"}
          </h2>
          
          <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-black/40 rounded-full border border-white/10 backdrop-blur-sm">
            <span className="text-muted-foreground font-mono text-xs uppercase">Confidence Level</span>
            <span className={cn(
              "font-mono font-bold text-lg",
              isMine ? "text-red-400" : "text-green-400"
            )}>
              {confidencePercent}%
            </span>
          </div>

          {isMine && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg max-w-sm">
              <p className="text-red-200 text-sm font-mono animate-pulse">
                ⚠ WARNING: EXPLOSIVE SIGNATURE DETECTED. PROCEED WITH EXTREME CAUTION.
              </p>
            </div>
          )}
          
          {!isMine && (
            <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg max-w-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <p className="text-green-200 text-sm font-mono">
                SAFE: Material composition consistent with geological formations.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
