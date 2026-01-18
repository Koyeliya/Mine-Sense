import { useState } from "react";
import { Header } from "@/components/Header";
import { SonarChart } from "@/components/SonarChart";
import { PredictionResult } from "@/components/PredictionResult";
import { useSubmitPrediction } from "@/hooks/use-predictions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Shuffle, Terminal, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data generator for demo purposes
const generateMockData = () => Array.from({ length: 60 }, () => Math.random());

export default function Home() {
  const [sonarData, setSonarData] = useState<number[]>(generateMockData());
  const [csvInput, setCsvInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { mutate: predict, data: prediction, isPending } = useSubmitPrediction();
  const { toast } = useToast();

  const handleRandomize = () => {
    setSonarData(generateMockData());
    toast({
      title: "Data Generated",
      description: "Random 60-band frequency data loaded into buffer.",
    });
  };

  const handleScan = () => {
    predict(sonarData);
  };

  const handleCsvImport = () => {
    try {
      const parsed = csvInput.split(',').map(n => parseFloat(n.trim()));
      if (parsed.length !== 60 || parsed.some(isNaN)) {
        throw new Error("Invalid data format. Must be 60 comma-separated numbers.");
      }
      setSonarData(parsed);
      setIsDialogOpen(false);
      setCsvInput("");
      toast({
        title: "Import Successful",
        description: "External sonar data loaded successfully.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: err.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-lg">
          <div>
            <h2 className="text-lg font-display text-foreground">Data Input Buffer</h2>
            <p className="text-sm text-muted-foreground font-mono">Channel Status: ACTIVE • 60 Bands</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={handleRandomize}
              className="font-mono text-xs border-primary/30 text-primary hover:bg-primary/10"
            >
              <Shuffle className="mr-2 h-4 w-4" />
              GENERATE_RANDOM
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="font-mono text-xs border-secondary-foreground/20">
                  <Terminal className="mr-2 h-4 w-4" />
                  IMPORT_CSV
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-card border-white/10 text-foreground">
                <DialogHeader>
                  <DialogTitle className="font-display">Import Sonar Data</DialogTitle>
                  <DialogDescription className="font-mono text-xs">
                    Paste a comma-separated string of 60 float values representing frequency returns.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea 
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    placeholder="0.02, 0.0371, 0.0428, 0.0207, 0.0954, ..."
                    className="font-mono text-xs h-[150px] bg-black/20 border-white/10 resize-none"
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleCsvImport} className="bg-primary hover:bg-primary/90 text-primary-foreground font-display">
                    LOAD DATA
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="ghost" disabled className="font-mono text-xs text-muted-foreground">
              <Upload className="mr-2 h-4 w-4" />
              UPLOAD_FILE
            </Button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[500px]">
          
          {/* Left Column: Chart */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-display text-muted-foreground flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-primary" />
                FREQUENCY SPECTRUM VISUALIZATION
              </h3>
            </div>
            
            <div className="flex-1 min-h-[300px] bg-card rounded-2xl p-1 border border-border shadow-lg relative">
              <SonarChart data={sonarData} animate={isPending} />
            </div>

            <Button 
              onClick={handleScan}
              disabled={isPending}
              size="lg"
              className="w-full h-14 text-lg font-display tracking-widest bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isPending ? "SCANNING TARGET..." : "INITIATE ANALYSIS SCAN"}
            </Button>
          </div>

          {/* Right Column: Result */}
          <div className="flex flex-col gap-4">
             <div className="flex items-center justify-between">
              <h3 className="text-md font-display text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                CLASSIFICATION REPORT
              </h3>
            </div>
            
            <div className="flex-1 min-h-[300px]">
              <PredictionResult 
                result={prediction?.result as "M" | "R" | null || null} 
                confidence={prediction?.confidence}
                isLoading={isPending} 
              />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
