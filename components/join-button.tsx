'use client';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { community } from '@/lib/community';
export function JoinButton({ compact = false }: { compact?: boolean }) {
  return (
    <Button
      nativeButton={false}
      render={
        <a
          href={community.inviteUrl}
          aria-label="Join the Discord (opens in a new tab)"
          target="_blank"
          rel="noopener noreferrer"
        />
      }
      className={`join-button ${compact ? 'join-compact' : ''}`}
    >
      Join the Discord <ArrowUpRight aria-hidden="true" />
    </Button>
  );
}
