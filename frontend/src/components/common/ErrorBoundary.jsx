import { Component } from 'react';
import PropTypes from 'prop-types';
import { RotateCcw } from 'lucide-react';
import { t } from '@/i18n';
import { detectDeviceLanguage } from '@/utils/deviceLocale';

export default class ErrorBoundary extends Component {
  static propTypes = { children: PropTypes.node };

  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Keep this in console — real reporting goes through Sentry/equivalent later.
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;
    const lang = detectDeviceLanguage();

    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-green-50 to-accent-50">
        <div className="bg-surface-0 rounded-3xl shadow-card border border-surface-200 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center text-display mb-4">
            😔
          </div>
          <h1 className="text-h2 font-bold text-surface-900 mb-2">{t('error_generic', lang)}</h1>
          <p className="text-body-sm text-surface-500 mb-5">{t('page_load_error', lang)}</p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-600 text-white font-bold shadow-lg active:scale-[0.97] transition-transform"
          >
            <RotateCcw size={18} /> {t('retry', lang)}
          </button>
        </div>
      </div>
    );
  }
}
