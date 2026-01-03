import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Our Work", href: "/our-work" },
    { name: "Get Involved", href: "/get-involved" },
    { name: "Resources", href: "/resources" },
    { name: "Contact", href: "/contact" },
  ];

  // Show admin link during development or when explicitly enabled via env
  const showAdmin = import.meta.env.DEV || import.meta.env.VITE_SHOW_ADMIN === "true";
  if (showAdmin) {
    navItems.push({ name: "Admin", href: "/admin" });
  }

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-trust-navy text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91-9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@aruleducation.in</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-trust-gold">Follow Us:</span>
              <div className="flex space-x-2">
                <Facebook className="w-4 h-4 hover:text-trust-gold cursor-pointer transition-colors" />
                <Twitter className="w-4 h-4 hover:text-trust-gold cursor-pointer transition-colors" />
                <Linkedin className="w-4 h-4 hover:text-trust-gold cursor-pointer transition-colors" />
                <Instagram className="w-4 h-4 hover:text-trust-gold cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AE</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">ArulEducation</h1>
                <p className="text-sm text-muted-foreground">Educational Trust</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href)
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Donate Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Link to="/donate">
                <Button variant="donate" size="lg" className="hidden md:flex">
                  <Heart className="w-4 h-4 mr-2" />
                  Donate Now
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-6 mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">AE</span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-primary">ArulEducation</h2>
                        <p className="text-sm text-muted-foreground">Educational Trust</p>
                      </div>
                    </div>
                    
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-lg font-medium transition-colors hover:text-primary ${
                          isActive(item.href) ? "text-primary" : "text-gray-700"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                    
                    <Link to="/donate">
                      <Button variant="donate" size="lg" className="mt-6 w-full">
                        <Heart className="w-4 h-4 mr-2" />
                        Donate Now
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;