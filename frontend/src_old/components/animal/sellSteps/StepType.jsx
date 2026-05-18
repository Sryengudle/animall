import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import useLanguage from '@/hooks/useLanguage';
import { ANIMAL_TYPES } from '@/constants/animals';

export default function StepType({ value, onChange }) {
  const { tr } = useLanguage();

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-h2 font-bold text-surface-900">{tr('sell_pick_animal')}</h2>
        <p className="text-body-sm text-surface-500 mt-1">{tr('sell_pick_breed')} →</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {ANIMAL_TYPES.map(({ key, emoji }, i) => {
          const active = value === key;
          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.97 }}
              aria-pressed={active}
              className={`
                relative aspect-[5/4] rounded-3xl p-4 flex flex-col items-center justify-center gap-2
                border-2 transition-all overflow-hidden
                ${active
                  ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-50 shadow-lg shadow-primary-500/10'
                  : 'border-surface-200 bg-surface-0 hover:border-primary-300'}
              `}
            >
              {active && (
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-md">
                  <Check size={14} />
                </span>
              )}
              <span className="text-display-xl">{emoji}</span>
              <span className={`text-body-sm font-bold ${active ? 'text-primary-700' : 'text-surface-700'}`}>
                {tr(key)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

StepType.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
