import { usePredictionHistory } from "@/hooks/use-predictions";
import { Header } from "@/components/Header";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, Database, AlertTriangle, Diamond } from "lucide-react";

export default function History() {
  const { data: history, isLoading } = usePredictionHistory();

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-secondary rounded-lg">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-display text-foreground">Scan Log Database</h2>
            <p className="text-muted-foreground font-mono text-sm">Historical records of all sonar analysis operations</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-xl overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex justify-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : !history?.length ? (
            <div className="p-12 text-center text-muted-foreground font-mono">
              NO RECORDS FOUND IN DATABASE
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-display text-primary w-[100px]">ID</TableHead>
                  <TableHead className="font-display text-primary">Result</TableHead>
                  <TableHead className="font-display text-primary">Confidence</TableHead>
                  <TableHead className="font-display text-primary">Timestamp</TableHead>
                  <TableHead className="font-display text-primary text-right">Raw Features</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => {
                  const isMine = item.result === "M";
                  return (
                    <TableRow key={item.id} className="border-border hover:bg-white/5 font-mono text-xs">
                      <TableCell className="font-medium">#{item.id}</TableCell>
                      <TableCell>
                        <Badge variant={isMine ? "destructive" : "secondary"} className={
                          isMine 
                            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-900" 
                            : "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-900"
                        }>
                          {isMine ? (
                            <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> MINE</span>
                          ) : (
                            <span className="flex items-center gap-1"><Diamond className="w-3 h-3"/> ROCK</span>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.confidence ? `${(item.confidence * 100).toFixed(1)}%` : "N/A"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.createdAt ? format(new Date(item.createdAt), "yyyy-MM-dd HH:mm:ss") : "-"}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        <span title={JSON.stringify(item.features)}>
                          {Array.isArray(item.features) ? `${item.features.length} bands stored` : "Invalid Data"}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}
