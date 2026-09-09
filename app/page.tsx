/* Images are pre-optimized local WebP assets; no runtime image service is needed. */
/* oxlint-disable next/no-img-element */
import {
  ArrowUpRight,
  Banknote,
  Gift,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';
import { JoinButton } from '@/components/join-button';
import { community, type DiscordFeatureIcon } from '@/lib/community';

const featureIcons = {
  layout: LayoutGrid,
  gift: Gift,
  banknote: Banknote,
} satisfies Record<DiscordFeatureIcon, LucideIcon>;

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a href="#main" className="brand" aria-label={community.name}>
          <img
            src="/images/wdfc-header-lockup.webp"
            width="512"
            height="312"
            alt=""
          />
        </a>
        <span className="header-note">
          INDEPENDENT COMMUNITY / NORTH AMERICA
        </span>
        <JoinButton compact />
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-visual">
            <img
              className="hero-image"
              src="/images/community-1920.webp"
              srcSet="/images/community-640.webp 640w, /images/community-960.webp 960w, /images/community-1440.webp 1440w, /images/community-1920.webp 1920w"
              sizes="(max-width: 640px) 100vw, (max-width: 1000px) 910px, 1032px"
              width="1920"
              height="1080"
              alt="A WARDOGS soldier helping a downed teammate beside a tank"
              fetchPriority="high"
            />
            <span className="photo-label">GOOD FIGHTS. BETTER COMPANY.</span>
            <span className="club-seal" aria-hidden="true">
              <img
                src="/images/wdfc-logo-512.webp"
                width="128"
                height="128"
                alt=""
              />
            </span>
          </div>
          <div className="hero-content">
            <h1 id="hero-title">
              <span className="sr-only">WARDOGS </span>
              <span>FIGHT</span>
              <span>
                CLUB
                <span className="title-period" aria-hidden="true">
                  ✳
                </span>
              </span>
            </h1>
            <p className="hero-tagline">{community.tagline}</p>
            <JoinButton />
          </div>
          <div className="hero-bottom">
            <span>
              NA BASED <i /> ENGLISH SPEAKING <i /> PVP FOCUSED
            </span>
          </div>
        </section>

        <section className="discord-life" aria-labelledby="discord-life-title">
          <div className="discord-life-heading">
            <div>
              <h2 id="discord-life-title">
                BUILT FOR THE
                <br />
                <em>WHOLE SQUAD.</em>
              </h2>
            </div>
            <p>
              Find people to play with and earn server rewards while you hang
              out. We run a new giveaway every month.
            </p>
          </div>
          <div className="feature-grid">
            {community.discordFeatures.map((feature) => {
              const Icon = featureIcons[feature.icon];

              return (
                <article className="feature-card" key={feature.number}>
                  <div className="feature-card-top">
                    <span>{feature.number}</span>
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="the-club" className="story" aria-labelledby="story-title">
          <div className="story-grid">
            <div className="story-copy">
              <h2 id="story-title">
                OUR STORY STARTED
                <br />
                WITH A <em>FISTFIGHT.</em>
              </h2>
              <p>{community.origin}</p>
            </div>
          </div>
          <figure className="squad-photo">
            <img
              src="/images/meet-the-squad-1672.webp"
              srcSet="/images/meet-the-squad-640.webp 640w, /images/meet-the-squad-960.webp 960w, /images/meet-the-squad-1440.webp 1440w, /images/meet-the-squad-1672.webp 1672w"
              sizes="(max-width: 640px) 88vw, 90vw"
              width="1672"
              height="941"
              loading="lazy"
              decoding="async"
              alt="The WARDOGS Fight Club squad gathered together in-game"
            />
            <figcaption>
              <span>MEET THE SQUAD</span>
              <span>WARDOGS FIGHT CLUB</span>
            </figcaption>
          </figure>
        </section>

        <section className="closing" aria-labelledby="join-title">
          <div>
            <h2 id="join-title">
              FIND YOUR
              <br />
              NEXT SQUAD<span>.</span>
            </h2>
          </div>
          <div className="closing-action">
            <p>Squad up with us on Discord.</p>
            <JoinButton />
          </div>
        </section>
      </main>
      <footer>
        <a href="#main" className="footer-brand">
          WARDOGS FIGHT CLUB<span>© 2026</span>
        </a>
        <p>
          Independent community. Not affiliated with BULKHEAD or Team17.
          <br />
          WARDOGS imagery belongs to BULKHEAD / Team17.
        </p>
        <a href={community.inviteUrl} target="_blank" rel="noopener noreferrer">
          DISCORD <ArrowUpRight size={14} />
        </a>
      </footer>
    </>
  );
}
