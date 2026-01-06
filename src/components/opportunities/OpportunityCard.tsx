import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  Globe, 
  Clock, 
  ExternalLink,
  Bookmark,
  Zap,
  Award,
  Code,
  Users
} from 'lucide-react';
import { Opportunity, CATEGORY_LABELS, MODE_LABELS, LEVEL_LABELS } from '@/types/opportunity';
import { getOpportunityStatus, getDaysUntilDeadline } from '@/lib/mock-data';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useToast } from '@/components/ui/use-toast';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const categoryIcons = {
  hackathon: Zap,
  internship: Users,
  opensource: Code,
  fellowship: Award,
};

const categoryColors = {
  hackathon: 'bg-hackathon text-white',
  internship: 'bg-internship text-white',
  opensource: 'bg-opensource text-white',
  fellowship: 'bg-fellowship text-white',
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const status = getOpportunityStatus(opportunity);
  const daysUntilDeadline = getDaysUntilDeadline(opportunity.applicationEnd);
  const CategoryIcon = categoryIcons[opportunity.category];
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { toast } = useToast();

  const isUrgent = status === 'ongoing' && daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  const bookmarked = isBookmarked(opportunity.id);

  const handleBookmarkClick = () => {
    toggleBookmark(opportunity.id);
    toast({
      title: bookmarked ? 'Removed bookmark' : 'Saved opportunity',
      description: bookmarked
        ? 'This opportunity has been removed from your saved list.'
        : 'You can find it later in your bookmarked opportunities.',
    });
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      {/* Featured badge */}
      {opportunity.featured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="secondary" className="bg-warning text-warning-foreground text-xs">
            Featured
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Logo or Icon */}
          <div className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center shrink-0",
            categoryColors[opportunity.category]
          )}>
            {opportunity.logoUrl ? (
              <img 
                src={opportunity.logoUrl} 
                alt={opportunity.organizer}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <CategoryIcon className="h-6 w-6" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Link to={`/opportunity/${opportunity.id}`}>
              <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {opportunity.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">{opportunity.organizer}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {opportunity.description}
        </p>

        {/* Key Info - Compact */}
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs">
                {format(opportunity.applicationEnd, 'MMM d')}
              </span>
            </div>
            {isUrgent && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0">
                {daysUntilDeadline}d
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            {opportunity.mode === 'online' ? (
              <Globe className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <MapPin className="h-3.5 w-3.5 shrink-0" />
            )}
            <span className="text-xs truncate">
              {opportunity.location || opportunity.country}
              {opportunity.isIndiaFocused && ' 🇮🇳'}
            </span>
          </div>

          {(opportunity.stipend || opportunity.prizes) && (
            <div className="flex items-center gap-2">
              <Award className="h-3.5 w-3.5 shrink-0 text-success" />
              <span className="text-xs text-success font-medium truncate">
                {opportunity.stipend || opportunity.prizes}
              </span>
            </div>
          )}
        </div>

        {/* Category & Domains - Compact */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="text-xs px-1.5 py-0">
            {CATEGORY_LABELS[opportunity.category]}
          </Badge>
          {opportunity.domains.slice(0, 2).map((domain) => (
            <span
              key={domain}
              className="text-xs px-1.5 py-0.5 rounded-full bg-secondary/50 text-secondary-foreground"
            >
              {domain}
            </span>
          ))}
          {opportunity.domains.length > 2 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary/50 text-secondary-foreground">
              +{opportunity.domains.length - 2}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Link to={`/opportunity/${opportunity.id}`} className="flex-1">
            <Button variant="default" size="sm" className="w-full text-xs">
              View Details
            </Button>
          </Link>
          <Button
            variant={bookmarked ? 'default' : 'outline'}
            size="icon"
            className={cn('shrink-0 h-8 w-8', bookmarked && 'bg-primary text-primary-foreground')}
            aria-pressed={bookmarked}
            aria-label={bookmarked ? 'Remove bookmark' : 'Save opportunity'}
            onClick={handleBookmarkClick}
          >
            <Bookmark className={cn('h-3.5 w-3.5', bookmarked && 'fill-current')} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
