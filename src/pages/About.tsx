import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Target, Eye, Award, ArrowRight } from "lucide-react";
import studentsImage from "@/assets/students-success.jpg";

const About = () => {
  const leadership = [
    {
      name: "Dr. Arun Kumar",
      role: "Chairman & Founder",
      bio: "25+ years in educational development and social impact initiatives.",
      image: "AK"
    },
    {
      name: "Prof. Meera Sharma",
      role: "CEO & Director",
      bio: "Former principal with expertise in curriculum development and teacher training.",
      image: "MS"
    },
    {
      name: "Rajesh Patel",
      role: "COO",
      bio: "Technology leader focused on digital transformation in education.",
      image: "RP"
    }
  ];

  const milestones = [
    { year: "1991", event: "ArulEducation Trust established with a vision to transform education" },
    { year: "2012", event: "First 10 schools supported with infrastructure development" },
    { year: "2015", event: "Launched digital literacy program reaching 1,000 students" },
    { year: "2018", event: "Scholarship program initiated, supporting 500 students annually" },
    { year: "2021", event: "Expanded to 15 states, reaching 50,000+ students" },
    { year: "2024", event: "Achieved milestone of transforming 200+ schools nationwide" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={studentsImage}
            alt="About our mission"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-trust-navy/90 via-primary/80 to-primary/60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-white">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              About <span className="hero-text bg-gradient-to-r from-trust-gold to-white bg-clip-text text-transparent">ArulEducation</span>
            </h1>
            <p className="text-xl lg:text-2xl leading-relaxed">
              Founded in 2009, ArulEducation Trust has been at the forefront of educational transformation, 
              empowering communities through quality education and creating opportunities for lifelong learning.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="text-center card-shadow border-0 group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To democratize quality education by breaking barriers of geography, economic status, and social inequality, 
                  ensuring every child has access to transformative learning opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center card-shadow border-0 group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Eye className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A world where education is the great equalizer, empowering individuals and communities to break the cycle of poverty 
                  and create sustainable prosperity for future generations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center card-shadow border-0 group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Our Values</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Transparency, integrity, innovation, and compassion guide every initiative we undertake, 
                  ensuring maximum impact and sustainable change in the communities we serve.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Our Story</h2>
            <p className="text-xl text-muted-foreground">
              What started as a small initiative to help local schools has grown into a nationwide movement 
              transforming educational landscapes across India.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-8 group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                    {milestone.year.slice(-2)}
                  </div>
                </div>
                <Card className="flex-1 card-shadow border-0 group-hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-primary">{milestone.year}</div>
                      <div className="text-muted-foreground">{milestone.event}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Leadership Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our experienced leadership team brings together decades of expertise in education, 
              technology, and social impact to drive our mission forward.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {leadership.map((leader, index) => (
              <Card key={index} className="text-center card-shadow border-0 group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl group-hover:scale-110 transition-transform">
                    {leader.image}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">{leader.name}</h3>
                  <div className="text-secondary font-medium mb-4">{leader.role}</div>
                  <p className="text-muted-foreground text-sm">{leader.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light text-white">
        <div className="container mx-auto px-4 text-center">
          <Award className="w-16 h-16 mx-auto mb-6 text-trust-gold animate-float" />
          <h2 className="text-4xl font-bold mb-6">Awards & Recognition</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Our commitment to educational excellence has been recognized by leading organizations 
            and government bodies across India.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-trust-gold">2023</div>
              <div className="font-medium">Excellence in Education Award</div>
              <div className="text-sm text-primary-foreground/80">Ministry of Education, Government of India</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-trust-gold">2022</div>
              <div className="font-medium">Best NGO in Education</div>
              <div className="text-sm text-primary-foreground/80">India Today Social Impact Awards</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-trust-gold">2021</div>
              <div className="font-medium">Digital Innovation in Education</div>
              <div className="text-sm text-primary-foreground/80">UNESCO Recognition</div>
            </div>
          </div>

          <div className="mt-12">
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              Join Our Mission
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;