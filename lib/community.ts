export type DiscordFeatureIcon = 'layout' | 'gift' | 'banknote';

export const community = {
  name: 'WARDOGS FIGHT CLUB',
  inviteUrl: 'https://discord.gg/ZvTg8g9YZ',
  tagline: 'Good fights. Good laughs. Find your squad.',
  origin:
    'Fight Club started when downed players had to fight each other for a revive.',
  discordFeatures: [
    {
      number: '01',
      icon: 'layout',
      title: 'Find what you need.',
      description:
        'Find a squad, read announcements, join voice, and manage your rewards in The Bank.',
    },
    {
      number: '02',
      icon: 'gift',
      title: 'Monthly giveaways.',
      description:
        'We run one community giveaway each month. Discord has the entry details and announces the winner.',
    },
    {
      number: '03',
      icon: 'banknote',
      title: 'Hanging out earns rewards.',
      description:
        'Chat and voice activity earn server money and XP. Spend it at The Bank on crates, materials, gear, and bases while you work your way up the leaderboard.',
    },
  ] satisfies ReadonlyArray<{
    number: string;
    icon: DiscordFeatureIcon;
    title: string;
    description: string;
  }>,
} as const;
