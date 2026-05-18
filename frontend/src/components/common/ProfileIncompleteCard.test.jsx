import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ProfileIncompleteCard from './ProfileIncompleteCard';
import { renderWithProviders } from '@/test/test-utils';

// Stub useNavigate so we can assert what the card navigates to without an
// actual route stack. ProfileIncompleteCard's only behaviour worth testing is
// where the two buttons send the user — everything else is pure render.
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

describe('<ProfileIncompleteCard />', () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  it('renders the title and each missing field label', () => {
    renderWithProviders(
      <ProfileIncompleteCard missingFields={['name', 'phone', 'address']} />,
    );

    // Translation in the test store defaults to 'en', so these are the
    // English labels from src/i18n/en.js.
    expect(screen.getByRole('heading', { name: /complete your profile to sell/i })).toBeInTheDocument();
    expect(screen.getByText('Your name')).toBeInTheDocument();
    expect(screen.getByText('Phone number')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('omits the missing-fields list when nothing is missing', () => {
    // Defensive guard against rendering an empty list; the parent decides
    // whether to mount this card at all, but the component should also be
    // resilient to a `[]` prop.
    renderWithProviders(<ProfileIncompleteCard missingFields={[]} />);

    expect(screen.queryByText('Your name')).not.toBeInTheDocument();
    expect(screen.queryByText('Phone number')).not.toBeInTheDocument();
  });

  it('CTA navigates to /edit-profile with ?return=/sell preserved', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfileIncompleteCard missingFields={['name']} />);

    await user.click(screen.getByRole('button', { name: /complete profile/i }));

    expect(navigateMock).toHaveBeenCalledWith('/edit-profile?return=/sell');
  });

  it('back link sends the user to /buy', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfileIncompleteCard missingFields={['phone']} />);

    await user.click(screen.getByRole('button', { name: /browse animals instead/i }));

    expect(navigateMock).toHaveBeenCalledWith('/buy');
  });
});
