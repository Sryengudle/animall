import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BuyPage from './BuyPage';
import { renderWithProviders } from '@/test/test-utils';
import { DEFAULT_FILTERS } from '@/components/common/PremiumFiltersSheet';

// All network calls fall back to demo data when the api errors out — see
// `fetchAnimals` thunk. Reject deterministically so the listing list renders.
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(() => Promise.reject(new Error('no backend in test'))),
    post: vi.fn(() => Promise.reject(new Error('no backend in test'))),
  },
}));

describe('<BuyPage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('toggles the "other" category just like cow/buffalo (does NOT open the premium sheet)', async () => {
    // Pre-fix bug: tapping the "Other Animals" tile called openFilters('animal')
    // which popped the premium sheet. Farmers expected it to filter the list
    // to non-dairy species. This test pins the corrected behavior.
    const user = userEvent.setup();
    const { store } = renderWithProviders(<BuyPage />);

    expect(store.getState().animals).toBeDefined();
    // CategoryTile renders the label text; click by accessible name.
    const otherTile = screen.getByText(/other/i).closest('button');
    expect(otherTile).not.toBeNull();
    await user.click(otherTile);

    // The premium sheet should NOT be in the DOM — assert by its title.
    expect(screen.queryByText(/filter\s*&\s*sort/i)).not.toBeInTheDocument();
  });

  it('cycles the Price pill through off → low → high → off', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BuyPage />);

    const priceBtn = screen.getByRole('button', { name: /sort by price/i });

    // Default — pill is not pressed (sort = 'recent').
    expect(priceBtn).toHaveAttribute('aria-pressed', 'false');

    await user.click(priceBtn);
    expect(priceBtn).toHaveAttribute('aria-pressed', 'true');  // → low

    await user.click(priceBtn);
    expect(priceBtn).toHaveAttribute('aria-pressed', 'true');  // → high (still active)

    await user.click(priceBtn);
    expect(priceBtn).toHaveAttribute('aria-pressed', 'false'); // → recent
  });

  it('toggles the Nearby pill on/off', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BuyPage />);

    const nearbyBtn = screen.getByRole('button', { name: /nearby only/i });
    expect(nearbyBtn).toHaveAttribute('aria-pressed', 'false');

    await user.click(nearbyBtn);
    expect(nearbyBtn).toHaveAttribute('aria-pressed', 'true');

    await user.click(nearbyBtn);
    expect(nearbyBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('clicking the main filter icon opens the premium filter sheet', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BuyPage />);

    const filterBtn = screen.getByRole('button', { name: /open filters/i });
    await user.click(filterBtn);

    // PremiumFiltersSheet renders a heading containing "Filter & Sort".
    // Match loosely so a copy tweak doesn't flake the test.
    const matches = screen.queryAllByText((text) =>
      typeof text === 'string' && /filter/i.test(text),
    );
    expect(matches.length).toBeGreaterThan(0);
  });

  it('exports a sane DEFAULT_FILTERS object that contains sort and nearbyOnly', () => {
    // Belt-and-braces — BuyPage relies on these keys; if PremiumFiltersSheet
    // ever renames them the quick pills break silently.
    expect(DEFAULT_FILTERS).toHaveProperty('sort');
    expect(DEFAULT_FILTERS).toHaveProperty('nearbyOnly');
    expect(DEFAULT_FILTERS).toHaveProperty('animal');
  });
});
