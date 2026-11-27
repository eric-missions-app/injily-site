import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import SourcePageTracker from '@/components/forms/SourcePageTracker';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: {
    default: 'injily',
    template: '%s | injily',
  },
  description:
    "We're building injily to help churches, evangelists and mission teams follow up with every new believer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        {/* Icon font: display=block avoids flashing ligature names ("menu") before it loads. */}
        {/* One instance (opsz 24, wght 400, unfilled) and only these glyphs; add a name to icon_names (kept
            alphabetical) whenever a component uses a new icon, or it shows as text. */}
        {/* no-page-custom-font is a Pages Router rule; this is the App Router root layout. */}
        {/* eslint-disable-next-line @next/next/google-font-display, @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=arrow_forward,calendar_month,campaign,church,close,diversity_3,event_repeat,expand_more,flag,groups,history,how_to_reg,insights,leaderboard,location_on,mail,menu,notification_important,notifications,palette,person_add,person_search,public,sticky_note_2,swap_horiz,task_alt,trending_up,upload_file,view_kanban,visibility_off&display=block"
        />
      </head>
      <body className="font-sans">
        <SourcePageTracker />
        {children}
      </body>
    </html>
  );
}
