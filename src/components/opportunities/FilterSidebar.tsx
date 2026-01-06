import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { 
  Filter, 
  X, 
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { 
  OpportunityCategory, 
  OpportunityMode, 
  OpportunityLevel,
  OpportunityFilters,
  CATEGORY_LABELS,
  MODE_LABELS,
  LEVEL_LABELS,
  DOMAINS
} from '@/types/opportunity';
import { cn } from '@/lib/utils';
import { mockOpportunities } from '@/lib/mock-data';

interface FilterSidebarProps {
  filters: OpportunityFilters;
  onFiltersChange: (filters: OpportunityFilters) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FilterSidebar({ 
  filters, 
  onFiltersChange, 
  searchQuery, 
  onSearchChange 
}: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toggleCategory = (category: OpportunityCategory) => {
    const current = filters.category || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    onFiltersChange({ ...filters, category: updated.length ? updated : undefined });
  };

  const toggleMode = (mode: OpportunityMode) => {
    const current = filters.mode || [];
    const updated = current.includes(mode)
      ? current.filter(m => m !== mode)
      : [...current, mode];
    onFiltersChange({ ...filters, mode: updated.length ? updated : undefined });
  };

  const toggleLevel = (level: OpportunityLevel) => {
    const current = filters.level || [];
    const updated = current.includes(level)
      ? current.filter(l => l !== level)
      : [...current, level];
    onFiltersChange({ ...filters, level: updated.length ? updated : undefined });
  };

  const toggleDomain = (domain: string) => {
    const current = filters.domains || [];
    const updated = current.includes(domain)
      ? current.filter(d => d !== domain)
      : [...current, domain];
    onFiltersChange({ ...filters, domains: updated.length ? updated : undefined });
  };

  const clearFilters = () => {
    onFiltersChange({});
    onSearchChange('');
  };

  const activeFilterCount = [
    filters.category?.length || 0,
    filters.mode?.length || 0,
    filters.level?.length || 0,
    filters.domains?.length || 0,
    filters.indiaOnly ? 1 : 0,
    filters.hasStipend ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const names = mockOpportunities
      .map((o) => o.name)
      .filter((name) => name.toLowerCase().includes(q));
    const organizers = mockOpportunities
      .map((o) => o.organizer)
      .filter((org) => org.toLowerCase().includes(q));
    const domains = DOMAINS.filter((d) => d.toLowerCase().includes(q));
    return Array.from(new Set([...names, ...organizers, ...domains])).slice(0, 6);
  }, [searchQuery]);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSuggestions(true);
            }}
            className="pl-9"
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 120);
            }}
            onFocus={() => {
              if (searchQuery.length >= 2) setShowSuggestions(true);
            }}
          />
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute z-20 mt-2 w-full rounded-md border border-border bg-popover shadow-md">
              <ul className="max-h-56 overflow-auto text-sm">
                {searchSuggestions.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-muted"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSearchChange(item);
                        setShowSuggestions(false);
                      }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Category */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Category</Label>
        <div className="space-y-2">
          {(Object.keys(CATEGORY_LABELS) as OpportunityCategory[]).map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.category?.includes(category) || false}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label 
                htmlFor={`category-${category}`}
                className="text-sm font-normal cursor-pointer"
              >
                {CATEGORY_LABELS[category]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Mode */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Mode</Label>
        <div className="space-y-2">
          {(Object.keys(MODE_LABELS) as OpportunityMode[]).map((mode) => (
            <div key={mode} className="flex items-center space-x-2">
              <Checkbox
                id={`mode-${mode}`}
                checked={filters.mode?.includes(mode) || false}
                onCheckedChange={() => toggleMode(mode)}
              />
              <Label 
                htmlFor={`mode-${mode}`}
                className="text-sm font-normal cursor-pointer"
              >
                {MODE_LABELS[mode]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Level */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Experience Level</Label>
        <div className="space-y-2">
          {(Object.keys(LEVEL_LABELS) as OpportunityLevel[]).map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={`level-${level}`}
                checked={filters.level?.includes(level) || false}
                onCheckedChange={() => toggleLevel(level)}
              />
              <Label 
                htmlFor={`level-${level}`}
                className="text-sm font-normal cursor-pointer"
              >
                {LEVEL_LABELS[level]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Quick Filters */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Quick Filters</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="india-only"
              checked={filters.indiaOnly || false}
              onCheckedChange={(checked) => 
                onFiltersChange({ ...filters, indiaOnly: checked ? true : undefined })
              }
            />
            <Label 
              htmlFor="india-only"
              className="text-sm font-normal cursor-pointer flex items-center gap-1"
            >
              India-focused 🇮🇳
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="has-stipend"
              checked={filters.hasStipend || false}
              onCheckedChange={(checked) => 
                onFiltersChange({ ...filters, hasStipend: checked ? true : undefined })
              }
            />
            <Label 
              htmlFor="has-stipend"
              className="text-sm font-normal cursor-pointer"
            >
              Has Stipend/Prize
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Domains */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Domains</Label>
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map((domain) => (
            <Badge
              key={domain}
              variant={filters.domains?.includes(domain) ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer transition-colors",
                filters.domains?.includes(domain) && "bg-primary text-primary-foreground"
              )}
              onClick={() => toggleDomain(domain)}
            >
              {domain}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <>
          <Separator />
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={clearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters ({activeFilterCount})
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-20 bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount}</Badge>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
