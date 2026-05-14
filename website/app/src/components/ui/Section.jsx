import Container from './Container';

const tones = {
  default: '',
  tinted:  'bg-brand-50/60',
  accent:  'bg-accent-50/40',
  dark:    'bg-brand-900 text-white',
};

const spacings = {
  sm: 'py-12 sm:py-16',
  md: 'py-16 sm:py-24',
  lg: 'py-20 sm:py-32',
};

export default function Section({
  tone = 'default',
  spacing = 'md',
  id,
  className = '',
  children,
}) {
  return (
    <section id={id} className={`${tones[tone]} ${spacings[spacing]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
