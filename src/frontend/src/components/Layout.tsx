import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth, useCurrentUser } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Layers,
  LogOut,
  Menu,
  Package,
  Scale,
  Settings,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    items: [{ label: "Tableau de bord", path: "/tableau-de-bord", icon: Home }],
  },
  {
    label: "Comptabilité",
    items: [
      {
        label: "Plan comptable",
        path: "/comptabilite/plan-comptable",
        icon: BookOpen,
      },
      { label: "Journal", path: "/comptabilite/journal", icon: FileText },
      { label: "Grand Livre", path: "/comptabilite/grand-livre", icon: Layers },
      { label: "Balance", path: "/comptabilite/balance", icon: Scale },
    ],
  },
  {
    label: "Facturation",
    items: [
      {
        label: "Factures clients",
        path: "/facturation/clients",
        icon: TrendingUp,
      },
      {
        label: "Factures fournisseurs",
        path: "/facturation/fournisseurs",
        icon: TrendingDown,
      },
      { label: "Tiers", path: "/tiers", icon: Users },
    ],
  },
  {
    label: "Stocks",
    items: [
      { label: "Produits", path: "/stocks/produits", icon: Package },
      { label: "Mouvements", path: "/stocks/mouvements", icon: ArrowLeftRight },
    ],
  },
  {
    items: [
      { label: "Trésorerie", path: "/tresorerie", icon: Wallet },
      { label: "Rapports", path: "/rapports", icon: BarChart3 },
      { label: "Paramètres", path: "/parametres", icon: Settings },
    ],
  },
];

function HazineLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 transition-smooth",
        collapsed ? "justify-center" : "",
      )}
    >
      {/* Geometric vault mark in gold */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        className="flex-shrink-0"
        aria-label="Logo Hazine"
        role="img"
      >
        <rect
          x="2"
          y="2"
          width="32"
          height="32"
          rx="7"
          fill="oklch(0.68 0.12 65 / 0.15)"
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
        <line
          x1="9.5"
          y1="9.5"
          x2="12.5"
          y2="12.5"
          stroke="oklch(0.68 0.12 65)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="23.5"
          y1="23.5"
          x2="26.5"
          y2="26.5"
          stroke="oklch(0.68 0.12 65)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {!collapsed && (
        <div className="flex flex-col leading-none">
          <span className="font-display font-bold text-sidebar-foreground text-lg tracking-wide">
            HAZINE
          </span>
          <span className="text-[9px] text-sidebar-primary font-mono tracking-widest uppercase">
            خزينة
          </span>
        </div>
      )}
    </div>
  );
}

function NavLink({
  item,
  collapsed,
  isActive,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      data-ocid={`nav-${item.path.replace(/\//g, "-").slice(1)}`}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth group",
        collapsed ? "justify-center" : "",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon
        className={cn(
          "flex-shrink-0 transition-smooth",
          collapsed ? "w-5 h-5" : "w-4 h-4",
          isActive
            ? "text-sidebar-primary-foreground"
            : "group-hover:scale-105",
        )}
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { logout } = useAuth();
  const { data: userProfile } = useCurrentUser();

  const isActive = (path: string) =>
    pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          role="button"
          tabIndex={0}
          aria-label="Fermer le menu"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-sidebar border-r border-sidebar-border transition-smooth z-50",
          "fixed lg:relative inset-y-0 left-0",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b border-sidebar-border flex-shrink-0",
            collapsed ? "justify-center px-0" : "justify-between",
          )}
        >
          <HazineLogo collapsed={collapsed} />
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors p-1 rounded"
              aria-label="Réduire la sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="flex justify-center py-2 border-b border-sidebar-border">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors p-1 rounded"
              aria-label="Agrandir la sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navGroups.map((group, gi) => (
            <div
              key={group.label ?? `group-${gi}`}
              className={gi > 0 ? "pt-2" : ""}
            >
              {group.label && !collapsed && (
                <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                  {group.label}
                </p>
              )}
              {group.label && collapsed && gi > 0 && (
                <Separator className="mx-2 mb-2 bg-sidebar-border" />
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  item={item}
                  collapsed={collapsed}
                  isActive={isActive(item.path)}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-sidebar-border">
          {!collapsed && (
            <div className="px-3 py-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sidebar-primary bg-sidebar-primary/10 px-2 py-1 rounded-full border border-sidebar-primary/20">
                <Scale className="w-3 h-3" />
                Conforme SCF · Loi 07-11
              </span>
            </div>
          )}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-3",
              collapsed ? "justify-center flex-col gap-1" : "",
            )}
          >
            <div
              className={cn("flex-1 min-w-0", collapsed ? "hidden" : "block")}
            >
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {userProfile?.nom ?? "Utilisateur"}
              </p>
              <p className="text-xs text-sidebar-foreground/50 truncate">
                {userProfile?.role ?? ""}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-smooth w-8 h-8"
              onClick={() => logout()}
              data-ocid="logout-btn"
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-16 flex-shrink-0 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 shadow-xs">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground leading-none">
                {userProfile?.nom ?? ""}
              </p>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">
                {userProfile?.role ?? ""}
              </p>
            </div>
            <div
              className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <span className="text-sm font-bold text-primary">
                {(userProfile?.nom?.[0] ?? "H").toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
