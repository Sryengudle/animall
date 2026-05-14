import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { CONTACT } from '../lib/constants';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-20 border-t border-border bg-white/60">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Logo withTagline />
            <p className="mt-4 text-sm text-muted max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="mt-5">
              <LanguageSwitcher />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink mb-3">{t('footer.product')}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/how-it-works" className="hover:text-brand-700">{t('nav.howItWorks')}</Link></li>
              <li><Link to="/features"     className="hover:text-brand-700">{t('nav.features')}</Link></li>
              <li><Link to="/download"     className="hover:text-brand-700">{t('nav.download')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink mb-3">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/about"   className="hover:text-brand-700">{t('nav.about')}</Link></li>
              <li><Link to="/contact" className="hover:text-brand-700">{t('nav.contact')}</Link></li>
              <li>
                <a href={`mailto:${CONTACT.partnerEmail}`} className="hover:text-brand-700">
                  Partners
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink mb-3">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/legal#privacy" className="hover:text-brand-700">{t('footer.privacy')}</Link></li>
              <li><Link to="/legal#terms"   className="hover:text-brand-700">{t('footer.terms')}</Link></li>
              <li><Link to="/legal#refund"  className="hover:text-brand-700">{t('footer.refund')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-muted">
          <p>{t('footer.rights')}</p>
          <p>
            <a href={`mailto:${CONTACT.supportEmail}`} className="hover:text-brand-700">
              {CONTACT.supportEmail}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
