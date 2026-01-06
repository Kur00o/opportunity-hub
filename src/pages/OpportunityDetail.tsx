import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockOpportunities, getOpportunityStatus, getDaysUntilDeadline } from '@/lib/mock-data';
import { CATEGORY_LABELS, MODE_LABELS, LEVEL_LABELS } from '@/types/opportunity';
import { format } from 'date-fns';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  MapPin,
  Globe,
  Clock,
  Users,
  Award,
  Code,
  Bookmark,
  Share2,
  Bell,
  CheckCircle,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useToast } from '@/components/ui/use-toast';

const categoryIcons = {
  hackathon: Zap,
  internship: Users,
  opensource: Code,
  fellowship: Award,
};

const categoryColors = {
  hackathon: 'bg-hackathon',
  internship: 'bg-internship',
  opensource: 'bg-opensource',
  fellowship: 'bg-fellowship',
};

export default function OpportunityDetail() {
  const { id } = useParams();
  const opportunity = mockOpportunities.find((opp) => opp.id === id);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { toast } = useToast();

  if (!opportunity) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Opportunity not found</h1>
          <Link to="/opportunities">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to opportunities
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const status = getOpportunityStatus(opportunity);
  const daysUntilDeadline = getDaysUntilDeadline(opportunity.applicationEnd);
  const CategoryIcon = categoryIcons[opportunity.category];
  const bookmarked = isBookmarked(opportunity.id);

  const statusColors = {
    upcoming: 'bg-info text-info-foreground',
    ongoing: 'bg-success text-success-foreground',
    past: 'bg-muted text-muted-foreground',
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(opportunity.name);
    const details = encodeURIComponent(`Application deadline for ${opportunity.name}\n\n${opportunity.officialLink}`);
    const dates = format(opportunity.applicationEnd, "yyyyMMdd");
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}/${dates}`;
    window.open(googleCalendarUrl, '_blank');
  };

  const handleReminder = () => {
    handleAddToCalendar();
    toast({
      title: 'Calendar opened',
      description: 'We opened Google Calendar so you can add a deadline reminder.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className={cn('py-12 md:py-16', categoryColors[opportunity.category])}>
          <div className="container mx-auto px-4">
            <Link
              to="/opportunities"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to opportunities
            </Link>

            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Icon */}
              <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                {opportunity.logoUrl ? (
                  <img
                    src={opportunity.logoUrl}
                    alt={opportunity.organizer}
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  <CategoryIcon className="h-10 w-10 text-white" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={statusColors[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
                  {opportunity.featured && (
                    <Badge variant="secondary" className="bg-warning text-warning-foreground">
                      Featured
                    </Badge>
                  )}
                  {opportunity.verified && (
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                  {opportunity.name}
                </h1>
                <p className="text-xl text-white/90">{opportunity.organizer}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{opportunity.description}</p>
                  </CardContent>
                </Card>

                {/* Eligibility */}
                <Card>
                  <CardHeader>
                    <CardTitle>Eligibility Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {opportunity.eligibility.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Tech Stack & Domains */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tech Stack & Domains</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Domains</h4>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.domains.map((domain) => (
                          <Badge key={domain} variant="secondary">
                            {domain}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Tech Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.techStack.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Selection Criteria */}
                {opportunity.selectionCriteria && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Selection Criteria</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{opportunity.selectionCriteria}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Actions Card */}
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-4">
                    {/* Deadline Warning */}
                    {status === 'ongoing' && daysUntilDeadline > 0 && (
                      <div className={cn(
                        'p-3 rounded-lg text-center',
                        daysUntilDeadline <= 7 ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                      )}>
                        <Clock className="h-4 w-4 inline mr-1" />
                        {daysUntilDeadline} days left to apply
                      </div>
                    )}

                    {/* Apply Button */}
                    <a
                      href={opportunity.applicationLink || opportunity.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full gap-2" size="lg">
                        Apply Now
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>

                    {/* Secondary Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 gap-2" onClick={handleAddToCalendar}>
                        <Calendar className="h-4 w-4" />
                        Add to Calendar
                      </Button>
                      <Button
                        variant={bookmarked ? 'default' : 'outline'}
                        size="icon"
                        aria-pressed={bookmarked}
                        aria-label={bookmarked ? 'Remove bookmark' : 'Save opportunity'}
                        onClick={() => {
                          toggleBookmark(opportunity.id);
                          toast({
                            title: bookmarked ? 'Removed bookmark' : 'Saved opportunity',
                            description: bookmarked
                              ? 'This opportunity has been removed from your saved list.'
                              : 'You can find it later in your bookmarked opportunities.',
                          });
                        }}
                      >
                        <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-current')} />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button variant="ghost" className="w-full gap-2" onClick={handleReminder}>
                      <Bell className="h-4 w-4" />
                      Set Reminder
                    </Button>

                    <Separator />

                    {/* Key Info */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{CATEGORY_LABELS[opportunity.category]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mode</span>
                        <span className="font-medium">{MODE_LABELS[opportunity.mode]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Level</span>
                        <span className="font-medium">{LEVEL_LABELS[opportunity.level]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium flex items-center gap-1">
                          {opportunity.mode === 'online' ? (
                            <Globe className="h-3 w-3" />
                          ) : (
                            <MapPin className="h-3 w-3" />
                          )}
                          {opportunity.location || opportunity.country}
                          {opportunity.isIndiaFocused && ' 🇮🇳'}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Dates */}
                    <div className="space-y-3 text-sm">
                      <h4 className="font-medium">Important Dates</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Applications Open</span>
                          <span>{format(opportunity.applicationStart, 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deadline</span>
                          <span className="font-medium text-destructive">
                            {format(opportunity.applicationEnd, 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Event Start</span>
                          <span>{format(opportunity.eventStart, 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Event End</span>
                          <span>{format(opportunity.eventEnd, 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stipend/Prize */}
                    {(opportunity.stipend || opportunity.prizes) && (
                      <>
                        <Separator />
                        <div className="text-center p-3 bg-success/10 rounded-lg">
                          <Award className="h-5 w-5 text-success mx-auto mb-1" />
                          <p className="font-semibold text-success">
                            {opportunity.stipend || opportunity.prizes}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
