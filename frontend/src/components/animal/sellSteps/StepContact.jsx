import PropTypes from 'prop-types';
import { Phone } from 'lucide-react';
import useLanguage from '@/hooks/useLanguage';
import { Input } from '@/components/ui';

export default function StepContact({ value, onChange, errors }) {
  const { tr } = useLanguage();

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-h2 font-bold text-surface-900">{tr('sell_step_contact')}</h2>
        <p className="text-body-sm text-surface-500 mt-1">{tr('sell_buyers_searching')}</p>
      </header>

      <Input
        label={`${tr('sell_contact')} *`}
        type="tel"
        inputMode="numeric"
        leftAddon={<span className="flex items-center gap-1">🇮🇳 +91</span>}
        icon={Phone}
        value={value.contactPhone}
        onChange={(e) =>
          onChange({ ...value, contactPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })
        }
        placeholder="9876543210"
        error={errors?.contactPhone}
      />

      <div className="bg-primary-50 border border-primary-200 rounded-2xl px-4 py-3 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
        <p className="text-body-sm text-primary-800 font-semibold">{tr('sell_buyers_searching')}</p>
      </div>
    </section>
  );
}

StepContact.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
};
