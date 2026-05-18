import PropTypes from 'prop-types';
import useLanguage from '@/hooks/useLanguage';
import { ANIMAL_TYPES } from '@/constants/animals';
import { Chip } from '@/components/ui';

// Horizontal scrollable strip of animal categories. Adds a synthetic 'all' entry.
export default function CategoryChips({ active, onChange, className = '' }) {
  const { tr } = useLanguage();

  const items = [
    { key: 'all', emoji: '🐾' },
    ...ANIMAL_TYPES.filter((a) => a.key !== 'other'),
  ];

  return (
    <div
      role="tablist"
      aria-label={tr('categories')}
      className={`flex items-center gap-2 overflow-x-auto scrollbar-hide ${className}`}
    >
      {items.map(({ key, emoji }) => (
        <Chip
          key={key}
          active={active === key}
          onClick={() => onChange(key)}
          icon={emoji}
        >
          {tr(key)}
        </Chip>
      ))}
    </div>
  );
}

CategoryChips.propTypes = {
  active: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};
