import { useTranslation } from 'react-i18next';
import Container from './ui/Container';

const ICONS = ['🔒', '🤝', '🌐'];

export default function TrustStrip() {
  const { t } = useTranslation();
  const items = [
    t('trustStrip.item1'),
    t('trustStrip.item2'),
    t('trustStrip.item3'),
  ];

  return (
    <div className="border-y border-border bg-white/60">
      <Container className="py-6">
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {items.map((label, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-sm font-medium text-ink"
            >
              <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-lg">
                {ICONS[i]}
              </span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
