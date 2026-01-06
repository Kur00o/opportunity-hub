import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { mockOpportunities } from '@/lib/mock-data';
import { 
  ArrowRight, 
  Search, 
  Calendar, 
  Bell, 
  Bookmark,
  Zap,
  Users,
  Code,
  Award,
  Globe,
  TrendingUp
} from 'lucide-react';

const stats = [
  { label: 'Opportunities', value: '500+', icon: TrendingUp },
  { label: 'Categories', value: '4', icon: Zap },
  { label: 'Countries', value: '50+', icon: Globe },
];

const categories = [
  { 
    id: 'hackathon', 
    name: 'Hackathons', 
    icon: Zap, 
    color: 'bg-hackathon',
    description: 'Compete, build & win prizes'
  },
  { 
    id: 'internship', 
    name: 'Internships', 
    icon: Users, 
    color: 'bg-internship',
    description: 'Gain industry experience'
  },
  { 
    id: 'opensource', 
    name: 'Open Source', 
    icon: Code, 
    color: 'bg-opensource',
    description: 'Contribute to real projects'
  },
  { 
    id: 'fellowship', 
    name: 'Fellowships', 
    icon: Award, 
    color: 'bg-fellowship',
    description: 'Funded learning programs'
  },
];

const features = [
  {
    icon: Search,
    title: 'Smart Search & Filters',
    description: 'Find opportunities by category, domain, level, location, and more.',
  },
  {
    icon: Calendar,
    title: 'Calendar Integration',
    description: 'Export deadlines to Google Calendar, iCal, or Outlook.',
  },
  {
    icon: Bell,
    title: 'Deadline Reminders',
    description: 'Never miss an application deadline with timely notifications.',
  },
  {
    icon: Bookmark,
    title: 'Save & Track',
    description: 'Bookmark opportunities and track your application status.',
  },
];

export default function Index() {
  const featuredOpportunities = mockOpportunities.filter(opp => opp.featured).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 animate-fade-in">
                🇮🇳 India-first • 🌍 Worldwide
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Discover Your Next{' '}
                <span className="gradient-text">Tech Opportunity</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Hackathons, internships, open-source programs, and fellowships—all in one place. 
                Find, filter, and never miss a deadline.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Link to="/opportunities">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Browse Opportunities
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/opportunities?india=1">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                    India-first View 🇮🇳
                  </Button>
                </Link>
                <Link to="/submit">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Submit Opportunity
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-8 md:gap-12 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-8">
              Explore by Category
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category, index) => (
                <Link 
                  key={category.id}
                  to={`/opportunities?category=${category.id}`}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-card border border-border rounded-xl p-5 md:p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                    <div className={`h-12 w-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Opportunities */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Featured Opportunities
              </h2>
              <Link to="/opportunities">
                <Button variant="ghost" className="gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredOpportunities.map((opportunity, index) => (
                <div 
                  key={opportunity.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <OpportunityCard opportunity={opportunity} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Built for students and developers who want to discover and track tech opportunities efficiently.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="bg-card border border-border rounded-xl p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-4">
                Start Your Journey Today
              </h2>
              <p className="text-primary-foreground/90 mb-6 max-w-xl mx-auto">
                Create an account to save opportunities, set reminders, and never miss a deadline.
              </p>
              <Link to="/auth?mode=signup">
                <Button size="lg" variant="secondary" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
