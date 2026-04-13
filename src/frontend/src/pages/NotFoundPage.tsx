import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>

        <h1 className="font-display text-6xl font-bold text-primary/20 mb-2">
          404
        </h1>
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">
          Page introuvable
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          La page que vous recherchez n'existe pas ou a été déplacée. Vérifiez
          l'URL ou retournez au tableau de bord.
        </p>

        <div className="flex justify-center gap-3">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
          >
            <Link to="/tableau-de-bord" data-ocid="notfound-home-btn">
              <Home className="w-4 h-4 mr-2" />
              Tableau de bord
            </Link>
          </Button>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground/60">
            Hazine · Conforme SCF - Loi 07-11
          </p>
        </div>
      </div>
    </div>
  );
}
