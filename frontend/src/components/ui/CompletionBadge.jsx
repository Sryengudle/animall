import PropTypes from 'prop-types';

// Amber pill that surfaces profile-completion gaps. Shown next to the user's name
// on the profile page (e.g. "10% Incomplete").
export default function CompletionBadge({ percent }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const remaining = 100 - clamped;
  if (remaining <= 0) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 text-accent-800 px-3 py-1 text-xs font-bold whitespace-nowrap">
      <span className="h-2 w-2 rounded-full bg-accent-500 animate-pulse shrink-0" />
      {remaining}% Incomplete
    </span>
  );
}

CompletionBadge.propTypes = {
  percent: PropTypes.number.isRequired,
};
