import PropTypes from 'prop-types';
import useLanguage from '@/hooks/useLanguage';
import { BottomSheet, Button, Chip } from '@/components/ui';
import { formatPrice } from '@/utils/formatters';

// Filter bottom sheet — price slider + breed list (when a single category is selected).
export default function AnimalFilters({
  open, onClose, onApply, onClear,
  priceRange, setPriceRange,
  breedOptions = [], activeBreed, setActiveBreed,
}) {
  const { tr } = useLanguage();
  const [min, max] = priceRange;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={tr('buy_filters_title')}
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onClear}>{tr('clear')}</Button>
          <Button fullWidth onClick={onApply}>{tr('apply')}</Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Price range */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-body-sm font-bold text-surface-800">{tr('buy_filter_price')}</p>
            <p className="text-caption font-semibold text-primary-700">
              {formatPrice(min)} – {formatPrice(max)}
            </p>
          </div>
          <input
            type="range"
            min={0}
            max={200000}
            step={5000}
            value={max}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-full accent-primary-600 h-2"
            aria-label={tr('buy_filter_price')}
          />
          <div className="flex justify-between text-[10px] text-surface-400 mt-1">
            <span>₹0</span>
            <span>₹2,00,000+</span>
          </div>
        </div>

        {/* Breeds (optional) */}
        {breedOptions.length > 0 && (
          <div>
            <p className="text-body-sm font-bold text-surface-800 mb-2">{tr('buy_filter_breed')}</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={!activeBreed} onClick={() => setActiveBreed('')}>{tr('all')}</Chip>
              {breedOptions.map(({ value, label }) => (
                <Chip
                  key={value}
                  active={activeBreed === value}
                  onClick={() => setActiveBreed(value)}
                >
                  {label}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}

AnimalFilters.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  priceRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  setPriceRange: PropTypes.func.isRequired,
  breedOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
  activeBreed: PropTypes.string,
  setActiveBreed: PropTypes.func.isRequired,
};
