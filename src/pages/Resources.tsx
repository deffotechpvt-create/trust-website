import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  Calendar,
  Search,
  Filter,
  BookOpen,
  BarChart3,
  Image,
  Video,
  ArrowRight,
  Eye
} from "lucide-react";

const Resources = () => {
  const resourceCategories = [
    {
      icon: FileText,
      title: "Annual Reports",
      count: 15,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: BarChart3,
      title: "Impact Studies",
      count: 8,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: BookOpen,
      title: "Research Papers",
      count: 12,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Image,
      title: "Photo Gallery",
      count: 500,
      color: "text-trust-gold",
      bgColor: "bg-trust-gold/10"
    },
    {
      icon: Video,
      title: "Videos",
      count: 25,
      color: "text-trust-green",
      bgColor: "bg-trust-green/10"
    }
  ];

  const featuredResources = [
    {
      title: "Annual Impact Report 2023-24",
      description: "Comprehensive overview of our educational initiatives, achievements, and financial transparency for the fiscal year 2023-24.",
      type: "Annual Report",
      date: "March 2024",
      pages: 68,
      downloads: 2547,
      category: "report"
    },
    {
      title: "Digital Literacy Impact Study",
      description: "Research analysis on the effectiveness of our digital literacy programs in rural communities across 10 states.",
      type: "Research Study",
      date: "January 2024",
      pages: 45,
      downloads: 1203,
      category: "research"
    },
    {
      title: "Teacher Training Methodology Guide",
      description: "Comprehensive guide covering our innovative teacher training approaches and best practices for educational excellence.",
      type: "Methodology Guide",
      date: "December 2023",
      pages: 32,
      downloads: 856,
      category: "guide"
    },
    {
      title: "Financial Transparency Report 2023",
      description: "Detailed breakdown of fund utilization, donor contributions, and expense allocation across all our programs.",
      type: "Financial Report",
      date: "April 2024",
      pages: 24,
      downloads: 1876,
      category: "financial"
    }
  ];

  const mediaGallery = [
    {
      title: "Scholarship Ceremony 2024",
      type: "Photo Album",
      count: 45,
      date: "March 2024",
      thumbnail: "photo"
    },
    {
      title: "Digital Library Inauguration",
      type: "Video",
      duration: "12:30",
      date: "February 2024",
      thumbnail: "video"
    },
    {
      title: "Teacher Training Workshop",
      type: "Photo Album",
      count: 67,
      date: "January 2024",
      thumbnail: "photo"
    },
    {
      title: "Impact Stories Documentary",
      type: "Video",
      duration: "25:45",
      date: "December 2023",
      thumbnail: "video"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-trust-navy via-primary to-accent opacity-90"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-white text-center mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Resources & <span className="hero-text bg-gradient-to-r from-trust-gold to-white bg-clip-text text-transparent">Publications</span>
            </h1>
            <p className="text-xl lg:text-2xl leading-relaxed mb-8">
              Access our comprehensive collection of reports, research studies, impact assessments, 
              and multimedia resources documenting our educational journey.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search reports, studies, and resources..."
                className="pl-12 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Explore Our Resources</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse through our extensive collection of educational materials, research findings, 
              and impact documentation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
            {resourceCategories.map((category, index) => (
              <Card key={index} className="text-center card-shadow border-0 group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${category.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className={`w-8 h-8 ${category.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{category.title}</h3>
                  <div className="text-2xl font-bold text-secondary">{category.count}+</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Featured Publications</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our latest reports and studies showcasing the impact and effectiveness of our educational programs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {featuredResources.map((resource, index) => (
              <Card key={index} className="card-shadow border-0 group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{resource.type}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {resource.date}
                        </div>
                      </div>
                      <CardTitle className="text-xl text-primary mb-3">{resource.title}</CardTitle>
                      <p className="text-muted-foreground text-sm leading-relaxed">{resource.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {resource.pages} pages
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {resource.downloads} downloads
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="default" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="default" size="lg">
              View All Publications
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Media Gallery</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Visual stories of our impact through photos and videos capturing moments of transformation 
              in the communities we serve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaGallery.map((media, index) => (
              <Card key={index} className="overflow-hidden card-shadow border-0 group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    {media.thumbnail === "photo" ? (
                      <Image className="w-16 h-16 text-primary opacity-50" />
                    ) : (
                      <Video className="w-16 h-16 text-secondary opacity-50" />
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="text-xs">
                      {media.type}
                    </Badge>
                  </div>
                  {media.type === "Video" && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {media.duration}
                    </div>
                  )}
                  {media.type === "Photo Album" && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {media.count} photos
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-primary mb-2">{media.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {media.date}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View Complete Gallery
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
     
    </Layout>
  );
};

export default Resources;