import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export default function SubmitOpportunity() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Submission received',
      description: 'Thank you! Community submissions and moderation will be added soon.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Submit an Opportunity
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Share hackathons, internships, fellowships, or open-source programs with the community. Our team
            will review and verify submissions before publishing.
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Basic Details
              <Badge variant="secondary">Community Submission (beta)</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Opportunity name</Label>
                <Input id="name" required placeholder="e.g. Google Summer of Code" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizing body</Label>
                <Input id="organizer" required placeholder="e.g. Google" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Official link</Label>
                <Input id="link" required type="url" placeholder="https://" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Primary region</Label>
                <Input id="region" placeholder="e.g. India, Worldwide" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Short description</Label>
                <Textarea
                  id="description"
                  required
                  rows={4}
                  placeholder="What is this opportunity about? Who is it for?"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Submit for review</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}


