'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Text Analysis' },
    { href: '/dashboard', label: 'Data Analysis' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 12a10 10 0 0 1 10-10" />
              <path d="M12 12a10 10 0 0 0 10 10" />
              <path d="M12 12a10 10 0 0 1-10 10" />
              <path d="M12 12a10 10 0 0 0-10-10" />
            </svg>
            <span className="font-bold">Sentiment Spectrum</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
