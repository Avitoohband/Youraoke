# Youraoke 🎤

A bilingual (English + Hebrew) karaoke companion app that helps you manage your favorite singers and songs, with direct YouTube karaoke search integration and automatic image fetching.

## ✨ Key Features

### 🎵 **Singer & Song Management**
- **Spotify-inspired layout** - Singers on the left sidebar, songs in the main view
- **Smart singer detection** - Automatically detects if a singer exists (no manual selection needed)
- **Organized by language** - Hebrew (עברית) and English sections with proper sorting (א-ת and A-Z)
- **Auto-complete suggestions** - Start typing a singer name to see existing matches
- **Title case formatting** - English text automatically formatted with proper capitalization

### 🖼️ **Automatic Image Fetching**
- **Wikipedia integration** - Fetches singer images automatically when adding new singers
- **Bilingual support** - Hebrew singers from Hebrew Wikipedia, English from English Wikipedia
- **Smart fallback** - Shows emoji placeholder if no image found
- **Server-side fetching** - Secure API calls with no CORS issues

### 🎬 **YouTube Karaoke Integration**
- **One-click search** - Click any song to open YouTube karaoke search
- **Language-aware** - Adds "karaoke" for English, "קריוקי" for Hebrew songs
- **Proper encoding** - Handles Hebrew characters correctly in URLs

### 🌍 **Bilingual Interface**
- **Full RTL support** - Right-to-left layout for Hebrew content
- **Auto language detection** - Detects Hebrew vs English based on characters
- **Grouped display** - Separate sections with headers for each language

### 🔐 **Secure Authentication**
- **Email-based auth** - Sign up and login with Supabase Auth
- **Password visibility toggle** - Eye icon to show/hide password
- **Loading indicators** - Visual feedback during authentication
- **Confirmation modals** - Beautiful modals for logout and deletions (no browser alerts)

### 🔒 **Privacy & Security**
- **Row Level Security (RLS)** - Users can only access their own data
- **Server-side operations** - All database and API calls happen securely on the server
- **No exposed keys** - Supabase service keys never exposed to client

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Database & Auth**: Supabase
- **Styling**: CSS Modules
- **Deployment**: Vercel (or any Next.js-compatible platform)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/youraoke.git
cd youraoke
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials from https://app.supabase.com/project/_/settings/api

4. Set up the Supabase database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the contents of `supabase/schema.sql`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Tables

**singers**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `name` (TEXT)
- `image_url` (TEXT, nullable) - Auto-fetched from Wikipedia API
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**songs**
- `id` (UUID, Primary Key)
- `singer_id` (UUID, Foreign Key to singers)
- `title` (TEXT)
- `language` (TEXT: 'en' or 'he')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Security

Row Level Security (RLS) is enabled on all tables to ensure users can only access their own data.

### Migrations

If you already have an existing database, run `supabase/migration_add_image_url.sql` to add the image_url column.

## 🚀 How to Use

1. **Sign up** or **Login** with your email
   - Use the eye icon to toggle password visibility
   - Loading spinner shows progress during authentication

2. **Browse your library**
   - Singers are displayed in the left sidebar
   - Organized into Hebrew (עברית) and English sections
   - Each singer shows their image (fetched from Wikipedia) and song count

3. **Add songs**
   - Click the **+** button in the sidebar header
   - Type a singer name - existing singers will show as suggestions
   - Enter the song title
   - Language is detected automatically (Hebrew or English)
   - Singer images are fetched automatically from Wikipedia

4. **Play karaoke**
   - Select a singer from the sidebar to view their songs
   - Click any song to open YouTube karaoke search in a new tab
   - Songs are displayed in a clean table with language indicators

5. **Manage your collection**
   - Delete individual songs by hovering and clicking the ✕ button
   - Delete entire singers with the "Delete Singer" button
   - All deletions require confirmation via modal dialogs

## 📁 Project Structure

```
youraoke/
├── app/
│   ├── actions/           # Server actions (auth, data operations)
│   ├── dashboard/         # Main dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (redirects)
├── components/
│   ├── AddSongForm.tsx   # Modal for adding songs
│   ├── AuthForm.tsx      # Login/signup form with password toggle
│   ├── ConfirmModal.tsx  # Reusable confirmation dialog
│   ├── DashboardClient.tsx  # Main dashboard with sidebar
│   ├── LoadingSpinner.tsx   # Loading indicator
│   └── SongsView.tsx     # Singer detail view with song list
├── utils/
│   ├── format.ts         # Text formatting (title case)
│   ├── language.ts       # Language detection and helpers
│   ├── wikipedia.ts      # Wikipedia API integration
│   └── supabase/         # Supabase client configurations
├── supabase/
│   ├── schema.sql        # Complete database schema with RLS
│   └── migration_add_image_url.sql  # Migration for existing databases
└── types/
    └── database.types.ts # TypeScript type definitions
```

## 🎨 UI/UX Highlights

- **Spotify-inspired design** - Dark theme with green accent colors
- **Smooth animations** - Hover effects, modal transitions, loading states
- **Responsive layout** - Works on desktop and mobile devices
- **Accessibility** - ARIA labels, keyboard navigation support
- **Visual feedback** - Loading spinners, hover states, active indicators
- **Smart organization** - Grouped by language, alphabetically sorted
- **No alert dialogs** - Beautiful custom modals for all confirmations

## 🛠️ Technical Highlights

- **Next.js 15** with App Router and Server Components
- **TypeScript** for type safety
- **Server Actions** for data mutations
- **Supabase SSR** with proper async cookie handling
- **Row Level Security** for data isolation
- **CSS Modules** for scoped styling
- **Wikipedia API** for automatic image fetching
- **Client-side state management** with React hooks
- **Optimistic UI updates** for better UX

## 📝 API Integration

### Wikipedia API
The app uses Wikipedia's REST API to fetch singer images:
- Endpoint: `https://{lang}.wikipedia.org/w/api.php`
- Auto-detects language (Hebrew/English) based on singer name
- Fetches 500px thumbnail images
- Server-side only (no CORS issues)
- Graceful fallback to emoji placeholder

### YouTube Search
Constructs search URLs for karaoke videos:
- Format: `https://www.youtube.com/results?search_query={singer}+{song}+{karaoke}`
- Proper URL encoding for Hebrew characters
- Opens in new tab with security attributes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Ideas for Future Enhancements
- Export/import song lists
- Share favorite singers with friends
- Direct video embedding
- Offline mode support
- Mobile apps (React Native)
- Voice search integration
- Playlist management

## 📄 License

MIT

## 🙏 Acknowledgments

Built with ❤️ using Next.js, Supabase, and the Wikipedia API.

