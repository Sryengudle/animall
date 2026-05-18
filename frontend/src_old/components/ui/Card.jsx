import PropTypes from 'prop-types';

// Plain rounded white card with shadow. Compose more complex layouts on top of this.
export default function Card({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag
      className={`bg-surface-0 rounded-2xl shadow-card border border-surface-200 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

Card.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  children: PropTypes.node,
};
