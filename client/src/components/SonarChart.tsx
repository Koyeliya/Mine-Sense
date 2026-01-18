import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

interface SonarChartProps {
  data: number[];
  animate?: boolean;
}

export function SonarChart({ data, animate = false }: SonarChartProps) {
  const chartData = data.map((value, index) => ({
    freq: index + 1,
    amplitude: value,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded shadow-xl font-mono text-xs">
          <p className="text-muted-foreground">FREQ_BAND: {label}</p>
          <p className="text-primary font-bold">AMP: {payload[0].value.toFixed(4)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px] md:h-[400px] bg-black/20 rounded-xl border border-white/5 p-4 relative overflow-hidden group">
      
      {/* Decorative Grid Lines for "Sonar" feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      {/* Animated Scan Line */}
      {animate && (
        <motion.div 
          className="absolute top-0 bottom-0 w-[2px] bg-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.8)] z-10 pointer-events-none"
          initial={{ left: "0%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 2, ease: "linear", repeat: Infinity }}
        />
      )}

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorAmp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="freq" 
            stroke="rgba(255,255,255,0.2)" 
            tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} 
            interval={5}
          />
          <YAxis 
            hide 
            domain={[0, 1]} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)' }} />
          <Area
            type="monotone"
            dataKey="amplitude"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAmp)"
            isAnimationActive={true}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="absolute top-4 right-4 font-mono text-xs text-primary/50 bg-black/40 px-2 py-1 rounded border border-primary/20">
        SIGNAL_VISUALIZER_V2
      </div>
    </div>
  );
}
