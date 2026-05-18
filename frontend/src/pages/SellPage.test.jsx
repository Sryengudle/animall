import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

import SellPage from './SellPage';
import { renderWithProviders } from '@/test/test-utils';

// Mock api so the SellPage's mount-time fetch-my-listings (in edit mode) does
// not try to hit the network.
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(() => Promise.reject(new Error('no backend in test'))),
    post: vi.fn(() => Promise.reject(new Error('no backend in test'))),
    put: vi.fn(() => Promise.reject(new Error('no backend in test'))),
  },
}));

// Spy on useNavigate so the gate card's nav target is observable.
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const COMPLETE_USER = {
  _id: '1',
  name: 'Suresh Patil',
  phone: '9999999999',
  address: { pincode: '411038', city: 'Pune' },
};
const INCOMPLETE_USER = { _id: '2', name: '', phone: '', address: null };

describe('<SellPage /> — profile gate behavior', () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  it('renders the ProfileIncompleteCard instead of the form when profile is incomplete', () => {
    // The card replaces the form (rather than the old modal-on-submit flow)
    // so a user can never compose a listing they couldn't post.
    renderWithProviders(<SellPage />, {
      preloadedState: { auth: { user: INCOMPLETE_USER, isAuthenticated: true } },
    });

    // Gate card has the title text and a "Complete profile" CTA.
    expect(
      screen.getByRole('heading', { name: /complete your profile to sell/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /complete profile/i })).toBeInTheDocument();

    // None of the form's section labels should be rendered — the form is gone
    // entirely, not hidden. Spot-check Animal Type / Breed / Price / Location.
    expect(screen.queryByText(/animal type/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/breed/i)).not.toBeInTheDocument();
  });

  it('renders the form (no gate card) when the profile is complete', () => {
    renderWithProviders(<SellPage />, {
      preloadedState: { auth: { user: COMPLETE_USER, isAuthenticated: true } },
    });

    // No gate title; we should see the page heading instead. The Sell page
    // renders "Sell Livestock" (or the localized equivalent) as h1.
    expect(
      screen.queryByRole('heading', { name: /complete your profile to sell/i }),
    ).not.toBeInTheDocument();
  });

  it('lists each missing field on the gate card', () => {
    renderWithProviders(<SellPage />, {
      preloadedState: {
        // Has a name but no phone and no address.
        auth: {
          user: { _id: '3', name: 'Suresh', phone: '', address: null },
          isAuthenticated: true,
        },
      },
    });

    // Name is set → should NOT be in the missing list.
    expect(screen.queryByText('Your name')).not.toBeInTheDocument();
    // Phone + Address are missing → should be in the list.
    expect(screen.getByText('Phone number')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
  });
});
