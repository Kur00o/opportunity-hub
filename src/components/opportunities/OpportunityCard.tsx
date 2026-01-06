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
        {/* Category & Level */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {CATEGORY_LABELS[opportunity.category]}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {MODE_LABELS[opportunity.mode]}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {LEVEL_LABELS[opportunity.level]}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {opportunity.description}
        </p>

        {/* Key Info */}
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="truncate">
              Deadline: {format(opportunity.applicationEnd, 'MMM d, yyyy')}
            </span>
            {isUrgent && (
              <Badge variant="destructive" className="text-xs ml-auto">
                {daysUntilDeadline}d left
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            {opportunity.mode === 'online' ? (
              <Globe className="h-4 w-4 shrink-0" />
            ) : (
              <MapPin className="h-4 w-4 shrink-0" />
            )}
            <span className="truncate">
              {opportunity.location || opportunity.country}
              {opportunity.isIndiaFocused && ' 🇮🇳'}
            </span>
          </div>

          {(opportunity.stipend || opportunity.prizes) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4 shrink-0" />
              <span className="truncate text-success font-medium">
                {opportunity.stipend || opportunity.prizes}
              </span>
            </div>
          )}
        </div>

        {/* Domains */}
        <div className="flex flex-wrap gap-1.5">
          {opportunity.domains.slice(0, 3).map((domain) => (
            <span
              key={domain}
              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
            >
              {domain}
            </span>
          ))}
          {opportunity.domains.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              +{opportunity.domains.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link to={`/opportunity/${opportunity.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <Button
            variant={bookmarked ? 'default' : 'ghost'}
            size="icon"
            className={cn('shrink-0', bookmarked && 'bg-primary text-primary-foreground')}
            aria-pressed={bookmarked}
            aria-label={bookmarked ? 'Remove bookmark' : 'Save opportunity'}
            onClick={handleBookmarkClick}
          >
            <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-current')} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
