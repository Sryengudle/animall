import PropTypes from 'prop-types';
import useLanguage from '@/hooks/useLanguage';
import { Card, Badge, ImageWithFallback } from '@/components/ui';
import { ANIMAL_META, breedI18nKey, calvingI18nKey } from '@/constants/animals';
import { formatPrice, formatPhoneDisplay } from '@/utils/formatters';

export default function StepReview({ value, previews }) {
  const { tr } = useLanguage();
  const meta = ANIMAL_META[value.type] || ANIMAL_META.other;

  const fields = [
    { key: 'breed',       label: tr('breed'),         display: value.breed ? tr(breedI18nKey(value.type, value.breed)) : '—' },
    { key: 'calving',     label: tr('calving'),       display: value.calving ? tr(calvingI18nKey(value.calving)) : '—' },
    { key: 'milkPerDay',  label: tr('milk_per_day'),  display: value.milkPerDay ? `${value.milkPerDay} ${tr('litre')}` : '—' },
    { key: 'price',       label: tr('price'),         display: value.price ? formatPrice(value.price) : '—' },
    { key: 'location',    label: tr('location'),      display: value.location || '—' },
    { key: 'description', label: tr('detail_description'), display: value.description || '—' },
    { key: 'contactPhone', label: tr('sell_contact'), display: value.contactPhone ? formatPhoneDisplay(value.contactPhone) : '—' },
  ];

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-h2 font-bold text-surface-900">{tr('sell_review_title')}</h2>
        <p className="text-body-sm text-surface-500 mt-1">{tr('sell_review_subtitle')}</p>
      </header>

      <Card className="overflow-hidden">
        <div className="relative">
          {previews[0] ? (
            <img src={previews[0]} alt="Preview" className="w-full h-56 object-cover" />
          ) : (
            <ImageWithFallback src={null} alt="" fallback={meta.emoji} className="w-full h-56" />
          )}
          <div className="absolute bottom-3 left-3">
            <Badge tone="green" className="!px-3 !py-1.5 !text-body-sm shadow-lg backdrop-blur-sm bg-white/90">
              {value.price ? formatPrice(value.price) : '—'}
            </Badge>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-body font-bold text-surface-900">{meta.emoji} {tr(value.type)}</p>
          <dl className="text-body-sm divide-y divide-surface-100">
            {fields.map(({ key, label, display }) => (
              <div key={key} className="flex justify-between py-2 gap-3">
                <dt className="text-surface-500">{label}</dt>
                <dd className="font-semibold text-surface-800 text-right truncate max-w-[60%]">{display}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Card>
    </section>
  );
}

StepReview.propTypes = {
  value: PropTypes.object.isRequired,
  previews: PropTypes.array.isRequired,
};
