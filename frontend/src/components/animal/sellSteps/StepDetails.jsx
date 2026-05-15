import PropTypes from 'prop-types';
import useLanguage from '@/hooks/useLanguage';
import { Input, Textarea, Chip } from '@/components/ui';
import { BREEDS, CALVING_OPTIONS, breedI18nKey, calvingI18nKey } from '@/constants/animals';

export default function StepDetails({ value, onChange, errors }) {
  const { tr } = useLanguage();
  const set = (k, v) => onChange({ ...value, [k]: v });

  const breedKeys = BREEDS[value.type] || [];
  const showCalving = ['cow', 'buffalo', 'goat'].includes(value.type);

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-h2 font-bold text-surface-900">{tr('sell_step_details')}</h2>
        <p className="text-body-sm text-surface-500 mt-1">{tr('sell_price_hint')}</p>
      </header>

      {/* Breed */}
      {breedKeys.length > 0 && (
        <div>
          <p className="text-body-sm font-bold text-surface-800 mb-2">
            {tr('sell_pick_breed')} <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {breedKeys.map((b) => (
              <Chip key={b} active={value.breed === b} onClick={() => set('breed', b)}>
                {tr(breedI18nKey(value.type, b))}
              </Chip>
            ))}
          </div>
          {errors?.breed && <p className="mt-1.5 text-caption font-semibold text-red-500">{errors.breed}</p>}
        </div>
      )}

      {/* Calving */}
      {showCalving && (
        <div>
          <p className="text-body-sm font-bold text-surface-800 mb-2">{tr('sell_pick_calving')}</p>
          <div className="flex flex-wrap gap-2">
            {CALVING_OPTIONS.map((c) => (
              <Chip key={c} active={value.calving === c} onClick={() => set('calving', c)}>
                {tr(calvingI18nKey(c))}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Milk per day */}
      {showCalving && (
        <Input
          label={tr('sell_milk')}
          hint={tr('sell_milk_hint')}
          type="number"
          inputMode="decimal"
          value={value.milkPerDay}
          onChange={(e) => set('milkPerDay', e.target.value)}
          placeholder={tr('sell_milk_placeholder')}
          rightAddon={tr('litre')}
        />
      )}

      {/* Price */}
      <Input
        label={`${tr('sell_price')} *`}
        hint={tr('sell_price_hint')}
        type="number"
        inputMode="numeric"
        value={value.price}
        onChange={(e) => set('price', e.target.value)}
        placeholder={tr('sell_price_placeholder')}
        leftAddon="₹"
        rightAddon={tr('rupees')}
        error={errors?.price}
      />

      {/* Location */}
      <Input
        label={`${tr('sell_location')} *`}
        hint={tr('sell_location_hint')}
        value={value.location}
        onChange={(e) => set('location', e.target.value)}
        placeholder={tr('sell_location_placeholder')}
        error={errors?.location}
      />

      {/* Description */}
      <Textarea
        label={tr('sell_description')}
        value={value.description}
        onChange={(e) => set('description', e.target.value)}
        placeholder={tr('sell_description_placeholder')}
        rows={3}
        maxLength={300}
      />
    </section>
  );
}

StepDetails.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
};
