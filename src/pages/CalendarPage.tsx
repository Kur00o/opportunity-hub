import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { mockOpportunities } from '@/lib/mock-data';
import { format, isSameDay } from 'date-fns';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const opportunitiesOnDate = selectedDate
    ? mockOpportunities.filter((opp) =>
        isSameDay(opp.applicationEnd, selectedDate) ||
        isSameDay(opp.eventStart, selectedDate) ||
        isSameDay(opp.eventEnd, selectedDate),
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Calendar View
          </h1>
          <p className="text-muted-foreground">
            Visualize deadlines and event dates for hackathons, programs, and internships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Deadlines & Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedDate ? `Opportunities on ${format(selectedDate, 'MMM d, yyyy')}` : 'Pick a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {opportunitiesOnDate.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No application deadlines or events on this date. Try another day.
                </p>
              ) : (
                <div className="space-y-4">
                  {opportunitiesOnDate.map((opp) => (
                    <div
                      key={opp.id}
                      className="border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <Link to={`/opportunity/${opp.id}`} className="font-medium text-foreground hover:text-primary">
                          {opp.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{opp.organizer}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Deadline: {format(opp.applicationEnd, 'MMM d')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Event: {format(opp.eventStart, 'MMM d')} - {format(opp.eventEnd, 'MMM d')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}


