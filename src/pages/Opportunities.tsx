import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { FilterSidebar } from '@/components/opportunities/FilterSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getOpportunityStatus } from '@/lib/mock-data';
import { useOpportunities } from '@/hooks/useOpportunities';
import { 
  OpportunityFilters, 
  OpportunityCategory, 
  OpportunityStatus 
} from '@/types/opportunity';
import { LayoutGrid, List, Clock, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortOption = 'deadline' | 'recent' | 'featured';

const statusTabs: { value: OpportunityStatus | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'All', icon: LayoutGrid },
  { value: 'upcoming', label: 'Upcoming', icon: Calendar },
  { value: 'ongoing', label: 'Ongoing', icon: Clock },
  { value: 'past', label: 'Past', icon: TrendingUp },
];

export default function Opportunities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('deadline');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeStatus, setActiveStatus] = useState<OpportunityStatus | 'all'>('all');
  
  // Fetch opportunities using the hook
  const { opportunities: allOpportunities, isLoading } = useOpportunities();
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<OpportunityFilters>(() => {
    const category = searchParams.get('category') as OpportunityCategory | null;
    const indiaOnly = searchParams.get('india') === '1';
    return {
      ...(category ? { category: [category] } : {}),
      ...(indiaOnly ? { indiaOnly: true } : {}),
    };
  });

  const filteredOpportunities = useMemo(() => {
    let result = [...allOpportunities];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(opp => 
        opp.name.toLowerCase().includes(query) ||
        opp.organizer.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query) ||
        opp.domains.some(d => d.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (activeStatus !== 'all') {
      result = result.filter(opp => getOpportunityStatus(opp) === activeStatus);
    }

    // Category
    if (filters.category?.length) {
      result = result.filter(opp => filters.category!.includes(opp.category));
    }

    // Mode
    if (filters.mode?.length) {
      result = result.filter(opp => filters.mode!.includes(opp.mode));
    }

    // Level
    if (filters.level?.length) {
      result = result.filter(opp => filters.level!.includes(opp.level));
    }

    // Domains
    if (filters.domains?.length) {
      result = result.filter(opp => 
        opp.domains.some(d => filters.domains!.includes(d))
      );
    }

    // India-focused
    if (filters.indiaOnly) {
      result = result.filter(opp => opp.isIndiaFocused);
    }

    // Has stipend
    if (filters.hasStipend) {
      result = result.filter(opp => opp.stipend || opp.prizes);
    }

    // Sort
    switch (sortBy) {
      case 'deadline':
        result.sort((a, b) => a.applicationEnd.getTime() - b.applicationEnd.getTime());
        break;
      case 'recent':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [allOpportunities, filters, searchQuery, sortBy, activeStatus]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Browse Opportunities
          </h1>
          <p className="text-muted-foreground">
            Discover hackathons, internships, open-source programs, and fellowships.
          </p>
        </div>

        {/* Status Tabs & India-first toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusTabs.map((tab) => (
              <Button
                key={tab.value}
                variant={activeStatus === tab.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveStatus(tab.value)}
                className="gap-2 shrink-0"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>
          <Button
            variant={filters.indiaOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                indiaOnly: prev.indiaOnly ? undefined : true,
              }))
            }
            className="gap-2 shrink-0"
          >
            <span>India-first</span>
            <span role="img" aria-label="India">
              🇮🇳
            </span>
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            opportunities={allOpportunities}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Trigger is inside FilterSidebar */}
                <div className="lg:hidden">
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={setFilters}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    opportunities={allOpportunities}
                  />
                </div>
                
                <Badge variant="secondary" className="hidden sm:flex">
                  {filteredOpportunities.length} opportunities
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Deadline (soonest)</SelectItem>
                    <SelectItem value="recent">Recently added</SelectItem>
                    <SelectItem value="featured">Featured first</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="hidden md:flex border border-border rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-8 w-8', viewMode === 'grid' && 'bg-muted')}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-8 w-8', viewMode === 'list' && 'bg-muted')}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Opportunities Grid */}
            {isLoading ? (
              <div className="text-center py-16">
                <div className="text-muted-foreground mb-4">Loading opportunities...</div>
              </div>
            ) : filteredOpportunities.length > 0 ? (
              <div className={cn(
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4'
              )}>
                {filteredOpportunities.map((opportunity, index) => (
                  <div 
                    key={opportunity.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <OpportunityCard opportunity={opportunity} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-muted-foreground mb-4">
                  No opportunities found matching your criteria.
                </div>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setFilters({});
                    setSearchQuery('');
                    setActiveStatus('all');
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
