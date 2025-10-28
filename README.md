# Youraoke 🎤

A bilingual (English + Hebrew) karaoke companion app that helps you manage your favorite singers and songs, with direct YouTube karaoke search integration.

## Features

- 🔐 **Secure Authentication** - Email-based sign up and login with Supabase Auth
- 🎵 **Singer & Song Management** - Organize your favorite songs by singer
- 🌍 **Bilingual Support** - Full English and Hebrew interface with RTL support
- 🎬 **YouTube Integration** - One-click karaoke search on YouTube
- 🔒 **Privacy First** - Your data is protected with Row Level Security

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

## Features

### Automatic Image Fetching
When you add a new singer, the app automatically fetches their image from Wikipedia API:
- ✅ **Bilingual support** - Hebrew singers from Hebrew Wikipedia, English from English Wikipedia
- ✅ Validates and sanitizes singer names
- ✅ Fetches 500px thumbnail images
- ✅ Falls back to emoji if no image found
- ✅ All API calls happen server-side for security

### Usage

1. **Sign up** or **Login** with your email
2. **Add singers** to your collection - images are fetched automatically!
3. **Add songs** under each singer
4. **Click on a song** to search for it on YouTube with karaoke suffix
   - English songs → "song name karaoke"
   - Hebrew songs → "song name קריוקי"

## Project Structure

```
youraoke/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Main application
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── utils/                 # Utility functions
│   └── supabase/         # Supabase client configurations
├── supabase/             # Database schema
└── types/                # TypeScript type definitions
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

