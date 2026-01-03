import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./lib/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import OurWork from "./pages/OurWork";
import GetInvolved from "./pages/GetInvolved";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Transparency from "./pages/Transparency";
import Shipping from "./pages/Shipping";
import CancellationRefunds from "./pages/CancellationRefunds";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/our-work/*" element={<OurWork />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/get-involved/*" element={<GetInvolved />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/*" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/cancellation-refunds" element={<CancellationRefunds />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
