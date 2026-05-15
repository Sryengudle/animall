import PropTypes from 'prop-types';

export default function EmptyState({ icon = '🐾', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-display mb-4 shadow-inner">
        {icon}
      </div>
      <p className="text-h3 font-bold text-surface-800">{title}</p>
      {subtitle && <p className="text-body-sm text-surface-500 mt-1 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
};
