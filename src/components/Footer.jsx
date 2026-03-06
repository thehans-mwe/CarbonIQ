import { motion } from 'framer-motion';

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/thehans-mwe/CarbonIQ',
    icon: (
      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-12">
      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-16" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Top row — brand + nav */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-16">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a017] to-[#f5c842] flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-serif font-semibold tracking-tight">
              Carbon<span className="gradient-text">IQ</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center gap-8">
            {['Features', 'About', 'GitHub'].map((link) => (
              <a
                key={link}
                href={link === 'GitHub' ? 'https://github.com/thehans-mwe/CarbonIQ' : `#${link.toLowerCase()}`}
                target={link === 'GitHub' ? '_blank' : undefined}
                rel={link === 'GitHub' ? 'noopener noreferrer' : undefined}
                className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Creator + social */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/8.x/notionists/svg?seed=HansDev42&backgroundColor=0a0a0a"
              alt="Creator"
              className="w-9 h-9 rounded-full ring-1 ring-white/[0.08] bg-[#0a0a0a]"
              loading="lazy"
            />
            <div>
              <span className="text-sm font-medium text-white/80">Thehan</span>
              <span className="block text-[11px] text-gray-600">Creator & Developer</span>
            </div>
          </div>

          <div className="flex gap-2">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-gray-500 hover:text-white transition-colors duration-200"
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-white/[0.04] mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-600">
            &copy; {new Date().getFullYear()} CarbonIQ. Built for a sustainable future.
          </p>
          <p className="text-[11px] text-gray-600">
            EPA 2024 &middot; DEFRA 2024 &middot; IPCC AR6
          </p>
        </div>
      </div>
    </footer>
  );
}
