import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Reviews from "./pages/Reviews";
import ReviewDetail from "./pages/ReviewDetail";
import About from "./pages/About";
import MyBooks from "./pages/MyBooks";
import Services from "./pages/Services";
import Archive from "./pages/Archive";
import Contact from "./pages/Contact";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/resenhas" component={Reviews} />
        <Route path="/resenhas/:id" component={ReviewDetail} />
        <Route path="/acervo-historico" component={Archive} />
        <Route path="/sobre" component={About} />
        <Route path="/meus-livros" component={MyBooks} />
        <Route path="/servicos" component={Services} />
        <Route path="/contato" component={Contact} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
