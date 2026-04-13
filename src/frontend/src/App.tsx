import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";

// Lazy loaded pages
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ChartOfAccountsPage = lazy(() => import("@/pages/ChartOfAccountsPage"));
const JournalPage = lazy(() => import("@/pages/JournalPage"));
const GrandLivrePage = lazy(() => import("@/pages/GrandLivrePage"));
const BalancePage = lazy(() => import("@/pages/BalancePage"));
const FacturesClientsPage = lazy(() => import("@/pages/FacturesClientsPage"));
const FacturesFournisseursPage = lazy(
  () => import("@/pages/FacturesFournisseursPage"),
);
const TiersPage = lazy(() => import("@/pages/TiersPage"));
const ProduitsPage = lazy(() => import("@/pages/ProduitsPage"));
const MouvementsStockPage = lazy(() => import("@/pages/MouvementsStockPage"));
const TresoreriePage = lazy(() => import("@/pages/TresoreriePage"));
const RapportsPage = lazy(() => import("@/pages/RapportsPage"));
const ParametresPage = lazy(() => import("@/pages/ParametresPage"));

function PageLoader() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-48" />
      <div className="grid grid-cols-4 gap-4 mt-6">
        {["s1", "s2", "s3", "s4"].map((id) => (
          <Skeleton key={id} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl mt-4" />
    </div>
  );
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing, login } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isInitializing) {
      login();
    }
  }, [isAuthenticated, isInitializing, login]);

  if (isInitializing || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Initialisation…</p>
        </div>
      </div>
    );
  }

  return <Layout>{children}</Layout>;
}

// Root route
const rootRoute = createRootRoute({
  notFoundComponent: NotFoundPage,
});

// Index route — redirect to dashboard
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/tableau-de-bord" });
  },
  component: () => null,
});

// Public routes
const connexionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/connexion",
  component: LoginPage,
});

// Protected routes
function makeProtected(Component: React.ComponentType) {
  return function ProtectedPage() {
    return (
      <ProtectedLayout>
        <Suspense fallback={<PageLoader />}>
          <Component />
        </Suspense>
      </ProtectedLayout>
    );
  };
}

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tableau-de-bord",
  component: makeProtected(DashboardPage),
});

const planComptableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/comptabilite/plan-comptable",
  component: makeProtected(ChartOfAccountsPage),
});

const journalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/comptabilite/journal",
  component: makeProtected(JournalPage),
});

const grandLivreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/comptabilite/grand-livre",
  component: makeProtected(GrandLivrePage),
});

const balanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/comptabilite/balance",
  component: makeProtected(BalancePage),
});

const facturesClientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/facturation/clients",
  component: makeProtected(FacturesClientsPage),
});

const facturesFournisseursRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/facturation/fournisseurs",
  component: makeProtected(FacturesFournisseursPage),
});

const tiersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tiers",
  component: makeProtected(TiersPage),
});

const produitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stocks/produits",
  component: makeProtected(ProduitsPage),
});

const mouvementsStockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stocks/mouvements",
  component: makeProtected(MouvementsStockPage),
});

const tresorerieRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tresorerie",
  component: makeProtected(TresoreriePage),
});

const rapportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rapports",
  component: makeProtected(RapportsPage),
});

const parametresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/parametres",
  component: makeProtected(ParametresPage),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  connexionRoute,
  dashboardRoute,
  planComptableRoute,
  journalRoute,
  grandLivreRoute,
  balanceRoute,
  facturesClientsRoute,
  facturesFournisseursRoute,
  tiersRoute,
  produitsRoute,
  mouvementsStockRoute,
  tresorerieRoute,
  rapportsRoute,
  parametresRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
