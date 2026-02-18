import { motion } from 'framer-motion';

const footerLinks = [
  {
    heading: 'Product',
    links: ['Features', 'Pricing', 'Integrations', 'Changelog'],
  },
  {
    heading: 'Company',
    links: ['About', 'Blog', 'Careers', 'Contact'],
  },
  {
    heading: 'Legal',
    links: ['Privacy', 'Terms', 'Security', 'Cookies'],
  },
];

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/thehans-mwe/CarbonIQ',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-10">
      {/* Animated divider */}
      <div className="animated-divider mb-16" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 group mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
                <svg className="w-5 h-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-serif font-semibold tracking-tight">
                Carbon<span className="gradient-text">IQ</span>
              </span>
            </a>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Empowering organizations to measure, manage, and minimize their
              carbon footprint with intelligent analytics.
            </p>

            {/* Creator */}
            <div className="flex items-center gap-3 mt-6 mb-4">
              <img
                src="https://api.dicebear.com/8.x/notionists/svg?seed=CarbonIQCreator&backgroundColor=0a0a0a"
                alt="Creator"
                className="w-10 h-10 rounded-full ring-2 ring-accent-green/30 bg-navy-800"
                loading="lazy"
              />
              <div>
                <span className="text-sm font-medium text-white/90">Hans</span>
                <span className="block text-xs text-gray-500">Creator</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-500 hover:text-white transition-colors duration-300"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} CarbonIQ. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Designed for a sustainable future.
          </p>
        </div>
      </div>
    </footer>
  );
}
