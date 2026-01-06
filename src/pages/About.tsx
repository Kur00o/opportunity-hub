import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            About OpportunityHub
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            OpportunityHub is a centralized discovery platform for hackathons, internships, fellowships, and
            global tech programs with an India-first focus and worldwide coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Built for students & early-career developers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                We aggregate and curate opportunities like GSoC, MLH hackathons, Smart India Hackathon, GitHub
                Externship, Outreachy, and more, so you don&apos;t have to hunt across dozens of websites and
                Discord servers.
              </p>
              <p>
                Use powerful filters, smart search, bookmarks, and calendar integration to track what matters
                to you month by month.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Roadmap
                <Badge variant="secondary">Coming soon</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1">
                <li>Personalized recommendations and saved profiles</li>
                <li>Verified admin dashboard and community moderation</li>
                <li>Email / push notifications before deadlines</li>
                <li>Public API for campuses and student communities</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}


