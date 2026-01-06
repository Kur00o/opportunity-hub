# Opportunity Compass

A modern, aesthetic, and fully responsive web application that acts as a centralized discovery platform for hackathons, global programs (like GSoC), internships, fellowships, and tech opportunities, with a primary focus on India but inclusive of worldwide events.

## Features

- **80+ Opportunities**: Comprehensive database of hackathons, internships, open-source programs, and fellowships
- **Real-time Data Fetching**: Integration with Google Search API and Gemini AI for live opportunity discovery
- **Advanced Filtering**: Filter by category, mode, level, domain, location, and more
- **Smart Search**: Type-ahead search suggestions with intelligent matching
- **India-First Toggle**: Quick filter for India-focused opportunities
- **Bookmarking**: Save opportunities for later viewing
- **Calendar Integration**: Visual calendar view for deadlines and event dates
- **Dark/Light Mode**: Beautiful UI with theme switching
- **Mobile-First**: Fully responsive design

## Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- API keys for Google Gemini and Google Custom Search (optional, app works with mock data)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd opportunity-compass-main
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional for API features):
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
VITE_GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

### Getting API Keys

**Google Gemini API Key:**
1. Visit https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy and paste into `.env`

**Google Custom Search API:**
1. Visit https://developers.google.com/custom-search/v1/overview
2. Create a project and enable Custom Search API
3. Create credentials (API key)
4. Create a Custom Search Engine at https://programmablesearchengine.google.com/
5. Copy API key and Search Engine ID to `.env`

**Note:** The app works perfectly without API keys using the comprehensive mock data (80+ opportunities). API keys enable real-time opportunity discovery.

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Build

Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer
│   ├── opportunities/    # OpportunityCard, FilterSidebar
│   └── ui/              # shadcn/ui components
├── hooks/
│   ├── useBookmarks.tsx      # Bookmark management
│   └── useOpportunities.tsx  # Data fetching hook
├── lib/
│   ├── api/
│   │   └── opportunityService.ts  # API integration
│   ├── mock-data.ts     # 80+ opportunities
│   └── utils.ts         # Utility functions
├── pages/
│   ├── Index.tsx         # Home page
│   ├── Opportunities.tsx # Browse page
│   ├── OpportunityDetail.tsx
│   ├── CalendarPage.tsx
│   ├── SubmitOpportunity.tsx
│   └── About.tsx
└── types/
    └── opportunity.ts   # TypeScript types
```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Query** - Data fetching & caching
- **React Router** - Routing
- **date-fns** - Date utilities
- **Google Gemini API** - AI-powered data extraction
- **Google Custom Search API** - Opportunity discovery

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
