import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, BookOpen, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-education.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Students learning together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-trust-navy/90 via-primary/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="hero-text bg-gradient-to-r from-white to-trust-gold bg-clip-text text-transparent">
                  Transforming
                </span>
                <br />
                <span className="text-white">Lives Through</span>
                <br />
                <span className="hero-text bg-gradient-to-r from-trust-gold to-white bg-clip-text text-transparent">
                  Education
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-2xl">
                Empowering communities through quality education, creating opportunities for lifelong learning, 
                and building a brighter future for generations to come.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/donate">
                <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                  <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Donate Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/our-work">
                <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                  Learn More About Our Work
                </Button>
              </Link>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pt-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-trust-gold/20 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-trust-gold" />
                </div>
                <div className="text-2xl font-bold text-trust-gold">50K+</div>
                <div className="text-sm text-gray-300">Students Empowered</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-trust-gold/20 rounded-lg flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6 text-trust-gold" />
                </div>
                <div className="text-2xl font-bold text-trust-gold">200+</div>
                <div className="text-sm text-gray-300">Schools Supported</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-trust-gold/20 rounded-lg flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6 text-trust-gold" />
                </div>
                <div className="text-2xl font-bold text-trust-gold">15+</div>
                <div className="text-sm text-gray-300">Years of Impact</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-trust-gold/20 rounded-lg flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-trust-gold" />
                </div>
                <div className="text-2xl font-bold text-trust-gold">1M+</div>
                <div className="text-sm text-gray-300">Lives Touched</div>
              </div>
            </div>
          </div>

          {/* Right side - could be additional content or kept clean */}
          <div className="hidden lg:block"></div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;