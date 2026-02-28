import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
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
      <Route path="/courses" component={Courses} />
      {/* Course-specific modules route */}
      <Route path="/modules/:courseId" component={Modules} />
      {/* Legacy route - defaults to EPF course */}
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
