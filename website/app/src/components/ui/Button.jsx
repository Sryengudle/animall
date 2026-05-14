import { Link } from 'react-router-dom';

const variants = {
  primary:
    'bg-brand-600 text-white shadow-button hover:bg-brand-700 focus-visible:ring-brand-600',
  secondary:
    'bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 focus-visible:ring-brand-600',
  ghost:
    'bg-transparent text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-600',
  accent:
    'bg-accent-500 text-white shadow-button hover:bg-accent-600 focus-visible:ring-accent-600',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-7 py-4 text-lg',
};

export default function Button({
  as = 'button',
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'min-h-[48px]',
    variants[variant],
    sizes[size],
    className,
  ].join(' ');

  if (to) return <Link to={to} className={classes} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={classes} {...rest}>{children}</a>;

  const Tag = as;
  return <Tag className={classes} {...rest}>{children}</Tag>;
}
