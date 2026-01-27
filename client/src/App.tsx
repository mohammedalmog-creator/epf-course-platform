import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Modules from "./pages/Modules";
import ModuleDetail from "./pages/ModuleDetail";
import LessonView from "./pages/LessonView";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import Certificate from "./pages/Certificate";
import GraduationProject from "./pages/GraduationProject";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/modules" component={Modules} />
      <Route path="/module/:id" component={ModuleDetail} />
      <Route path="/lesson/:id" component={LessonView} />
      <Route path="/quiz/:id" component={Quiz} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/certificate/:id" component={Certificate} />
      <Route path="/graduation-project" component={GraduationProject} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
