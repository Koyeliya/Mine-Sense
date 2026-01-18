import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <Header />
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-display text-primary">System Protocol & Documentation</h1>
          <p className="text-muted-foreground font-mono">Operating Manual for Sonar Classification Unit v2.4</p>
        </div>

        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="font-display text-xl">Operational Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground text-sm leading-relaxed">
            <p>
              The <strong>GEOSCAN Rock vs. Mine Detection System</strong> utilizes advanced machine learning algorithms 
              to analyze sonar return signals bounced off underwater objects. 
              The system processes frequency-modulated sonar chirps across 60 distinct energy bands.
            </p>
            <p>
              This technology allows mining operations to safely distinguish between valuable geological formations (Rocks) 
              and potentially hazardous naval mines or unexploded ordnance (Mines) without direct contact.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="font-display text-lg text-green-400">Rock Formations (R)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                Natural geological structures characterized by irregular surface textures and varying density.
              </p>
              <ul className="list-disc list-inside space-y-1 font-mono text-xs text-green-200/60">
                <li>Irregular signal decay</li>
                <li>High frequency absorption</li>
                <li>Non-symmetrical return patterns</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="font-display text-lg text-red-400">Metal Cylinders / Mines (M)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                Artificial metallic objects, typically cylindrical, characterized by high reflectivity and uniform density.
              </p>
              <ul className="list-disc list-inside space-y-1 font-mono text-xs text-red-200/60">
                <li>Sharp spectral peaks</li>
                <li>Consistent signal strength</li>
                <li>Harmonic resonance patterns</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-white/10" />

        <div className="text-center font-mono text-xs text-muted-foreground/50">
          <p>CONFIDENTIAL // INTERNAL USE ONLY</p>
          <p>SYSTEM ID: 894-XJ-22</p>
        </div>
      </main>
    </div>
  );
}
