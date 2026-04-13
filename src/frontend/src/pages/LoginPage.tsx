import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { Lock, Scale, Shield } from "lucide-react";
import { useEffect } from "react";

function VaultMark() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      className="drop-shadow-lg"
      aria-label="Hazine logo coffre-fort"
      role="img"
    >
      <rect
        x="4"
        y="4"
        width="64"
        height="64"
        rx="14"
        fill="oklch(0.35 0.18 260 / 0.08)"
        stroke="oklch(0.68 0.12 65)"
        strokeWidth="2"
      />
      <circle
        cx="36"
        cy="36"
        r="20"
        stroke="oklch(0.68 0.12 65)"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="36" cy="36" r="9" fill="oklch(0.68 0.12 65)" />
      <circle cx="36" cy="36" r="5" fill="oklch(0.35 0.18 260)" />
      {/* Dial marks */}
      <line
        x1="36"
        y1="12"
        x2="36"
        y2="20"
        stroke="oklch(0.68 0.12 65)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="36"
        y1="52"
        x2="36"
        y2="60"
        stroke="oklch(0.68 0.12 65)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="36"
        x2="20"
        y2="36"
        stroke="oklch(0.68 0.12 65)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="52"
        y1="36"
        x2="60"
        y2="36"
        stroke="oklch(0.68 0.12 65)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="18.7"
        y1="18.7"
        x2="24.5"
        y2="24.5"
        stroke="oklch(0.68 0.12 65)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="47.5"
        y1="47.5"
        x2="53.3"
        y2="53.3"
        stroke="oklch(0.68 0.12 65)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="53.3"
        y1="18.7"
        x2="47.5"
        y2="24.5"
        stroke="oklch(0.68 0.12 65)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="24.5"
        y1="47.5"
        x2="18.7"
        y2="53.3"
        stroke="oklch(0.68 0.12 65)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const features = [
  { icon: Shield, text: "Conforme SCF / Loi 07-11" },
  { icon: Lock, text: "Données sécurisées sur Internet Computer" },
  { icon: Scale, text: "Plan comptable algérien complet" },
];

export default function LoginPage() {
  const { login, isAuthenticated, isLoggingIn, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/tableau-de-bord" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              aria-label="Logo Hazine"
              role="img"
            >
              <rect
                x="2"
                y="2"
                width="36"
                height="36"
                rx="8"
                fill="none"
                stroke="oklch(0.68 0.12 65)"
                strokeWidth="1.5"
              />
              <circle
                cx="20"
                cy="20"
                r="10"
                stroke="oklch(0.68 0.12 65)"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="20" cy="20" r="4.5" fill="oklch(0.68 0.12 65)" />
              <line
                x1="20"
                y1="7"
                x2="20"
                y2="11"
                stroke="oklch(0.68 0.12 65)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="20"
                y1="29"
                x2="20"
                y2="33"
                stroke="oklch(0.68 0.12 65)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="7"
                y1="20"
                x2="11"
                y2="20"
                stroke="oklch(0.68 0.12 65)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="29"
                y1="20"
                x2="33"
                y2="20"
                stroke="oklch(0.68 0.12 65)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <div className="font-display font-bold text-primary-foreground text-2xl tracking-widest">
                HAZINE
              </div>
              <div className="text-accent text-xs font-mono tracking-widest">
                خزينة
              </div>
            </div>
          </div>

          <h2 className="font-display text-4xl font-bold text-primary-foreground leading-tight mb-4">
            Comptabilité algérienne moderne
          </h2>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">
            Solution SaaS conforme au Système Comptable Financier (SCF) et à la
            Loi 07-11. Gérez votre comptabilité, vos stocks et votre trésorerie
            en toute simplicité.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-accent" />
              </div>
              <span className="text-primary-foreground/80 text-sm">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              aria-label="Logo Hazine"
              role="img"
            >
              <rect
                x="2"
                y="2"
                width="32"
                height="32"
                rx="7"
                fill="oklch(0.35 0.18 260 / 0.1)"
                stroke="oklch(0.68 0.12 65)"
                strokeWidth="1.5"
              />
              <circle
                cx="18"
                cy="18"
                r="9"
                stroke="oklch(0.68 0.12 65)"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="18" cy="18" r="4" fill="oklch(0.68 0.12 65)" />
              <line
                x1="18"
                y1="6"
                x2="18"
                y2="10"
                stroke="oklch(0.68 0.12 65)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="18"
                y1="26"
                x2="18"
                y2="30"
                stroke="oklch(0.68 0.12 65)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="6"
                y1="18"
                x2="10"
                y2="18"
                stroke="oklch(0.68 0.12 65)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="26"
                y1="18"
                x2="30"
                y2="18"
                stroke="oklch(0.68 0.12 65)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-display font-bold text-primary text-2xl tracking-widest">
              HAZINE
            </span>
          </div>

          {/* Login card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-elevated">
            {/* Vault icon */}
            <div className="flex justify-center mb-6">
              <VaultMark />
            </div>

            <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
              Connectez-vous à Hazine
            </h1>
            <p className="text-muted-foreground text-sm text-center mb-8 leading-relaxed">
              Solution de comptabilité algérienne
              <br />
              conforme SCF / Loi 07-11
            </p>

            <Button
              data-ocid="login-btn"
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth shadow-sm"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Connexion en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Utiliser Internet Identity
                </span>
              )}
            </Button>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-accent" />
                  Connexion sans mot de passe
                </span>
                <span className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-accent" />
                  Conforme SCF · Loi 07-11
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            © {new Date().getFullYear()} Hazine. Construit avec{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
