import { Link, useLocation } from "wouter";
import { Radar, History, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { label: "Sonar Deck", icon: Radar, href: "/" },
    { label: "Scan Log", icon: History, href: "/history" },
    { label: "Protocol", icon: Info, href: "/about" },
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg border border-primary/30 flex items-center justify-center animate-pulse">
              <Radar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-display tracking-wider text-foreground">
                GEO<span className="text-primary">SCAN</span>
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase">
                Mining Operations Unit 04
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.2)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
