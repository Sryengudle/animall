import PropTypes from 'prop-types';
import { useState } from 'react';
import Skeleton from './Skeleton';

// Renders a skeleton while loading, the image when ready, and a fallback (emoji or
// custom node) if the image is missing or fails to load.
export default function ImageWithFallback({
  src,
  alt,
  fallback = '🐾',
  className = '',
  imgClassName = '',
  loading = 'lazy',
  ...rest
}) {
  const [status, setStatus] = useState(src ? 'loading' : 'error');

  if (!src || status === 'error') {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 ${className}`}>
        <span className="text-display-xl select-none" aria-label={alt}>{fallback}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-surface-100 ${className}`}>
      {status === 'loading' && <Skeleton className="absolute inset-0" rounded="rounded-none" />}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`relative w-full h-full transition-opacity duration-300
                    ${status === 'loaded' ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        {...rest}
      />
    </div>
  );
}

ImageWithFallback.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  fallback: PropTypes.node,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
  loading: PropTypes.oneOf(['eager', 'lazy']),
};
