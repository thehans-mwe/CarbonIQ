import { memo } from 'react';

const BackgroundEffects = memo(function BackgroundEffects() {
  return (
    <div className="pointer-events-none" aria-hidden="true">
      <div className="bg-grid-pattern" />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="noise-overlay" />
    </div>
  );
});

export default BackgroundEffects;
