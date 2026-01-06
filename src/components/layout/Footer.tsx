import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">OH</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                OpportunityHub
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Discover hackathons, internships, open-source programs, and fellowships worldwide.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/opportunities?category=hackathon"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hackathons
                </Link>
              </li>
              <li>
                <Link
                  to="/opportunities?category=internship"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Internships
                </Link>
              </li>
              <li>
                <Link
                  to="/opportunities?category=opensource"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Open Source Programs
                </Link>
              </li>
              <li>
                <Link
                  to="/opportunities?category=fellowship"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Fellowships
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Key Programs</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://summerofcode.withgoogle.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Google Summer of Code (GSoC)
                </a>
              </li>
              <li>
                <a
                  href="https://ghw.mlh.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  MLH Global Hack Weeks
                </a>
              </li>
              <li>
                <a
                  href="https://www.sih.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Smart India Hackathon
                </a>
              </li>
              <li>
                <a
                  href="https://lfx.linuxfoundation.org/tools/mentorship/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  LFX Mentorships
                </a>
              </li>
              <li>
                <a
                  href="https://www.outreachy.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Outreachy
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@opportunityhub.dev"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Mail className="h-3 w-3" />
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OpportunityHub. Made with ❤️ for students & developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
