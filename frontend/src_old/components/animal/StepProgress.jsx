import PropTypes from 'prop-types';

// Visual indicator for wizard steps. Each dot shows label; active is wider.
// Colors use theme tokens so light/dark mode swaps automatically.
const BAR_TONE = {
  idle:   'bg-surface-200',
  active: 'bg-primary-600',
  done:   'bg-primary-500',
};

export default function StepProgress({ steps, current }) {
  return (
    <ol className="flex items-center gap-2 w-full">
      {steps.map((label, i) => {
        const state =
          i < current ? 'done' : i === current ? 'active' : 'idle';
        return (
          <li key={label} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors duration-300 ${BAR_TONE[state]}`}
            />
            <p className={`mt-1.5 text-[10px] font-semibold truncate ${
              state === 'idle' ? 'text-surface-400' : 'text-surface-700'
            }`}>
              {label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

StepProgress.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  current: PropTypes.number.isRequired,
};
