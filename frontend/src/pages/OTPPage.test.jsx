import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import OTPPage from './OTPPage';
import { renderWithProviders } from '@/test/test-utils';

// Mock react-router-dom — we want to assert navigation targets without
// owning a full route stack. Re-export `useSearchParams` etc. unchanged.
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

// Mock the api module the auth slice imports. verifyOTP's thunk falls back to
// a mock-success path if api.post throws, so by making the post throw we
// exercise that branch deterministically without a network call.
vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(() => Promise.reject(new Error('no backend in test'))),
  },
}));

describe('<OTPPage />', () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  it('bounces to /login when there is no pendingPhone in state', () => {
    // OTPPage useEffect: if pendingPhone is null the user must have landed
    // here via a deep link without going through phone entry — bounce them.
    renderWithProviders(<OTPPage />, { preloadedState: { auth: { pendingPhone: null } } });

    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  it('renders six digit inputs and a verify button when pendingPhone is set', () => {
    renderWithProviders(<OTPPage />, {
      preloadedState: { auth: { pendingPhone: '9999999999' } },
    });

    // Six aria-labelled digit inputs (Digit 1 … Digit 6) + verify button.
    expect(screen.getByLabelText('Digit 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Digit 6')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verify otp|verify/i })).toBeInTheDocument();
  });

  it('navigates to /buy on successful OTP submission (replace history)', async () => {
    const user = userEvent.setup();
    renderWithProviders(<OTPPage />, {
      preloadedState: { auth: { pendingPhone: '9999999999' } },
    });

    // Type a 6-digit OTP — the api mock rejects, so verifyOTP falls into its
    // mock-success branch (any /^\d{6}$/ otp resolves with a fake user).
    for (let i = 1; i <= 6; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await user.type(screen.getByLabelText(`Digit ${i}`), String(i));
    }

    await user.click(screen.getByRole('button', { name: /verify otp|verify/i }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/buy', { replace: true });
    });
  });

  it('does NOT render the AuthLoadingScreen during verification', async () => {
    // Pre-fix bug: a local `isVerifying` state short-circuited the page to
    // AuthLoadingScreen the moment the user hit Verify, which hid the button
    // spinner AND caused a flicker that read as "login showed up again".
    // We assert the OTP inputs stay mounted while the request is in flight.
    const user = userEvent.setup();
    renderWithProviders(<OTPPage />, {
      preloadedState: { auth: { pendingPhone: '9999999999' } },
    });

    for (let i = 1; i <= 6; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await user.type(screen.getByLabelText(`Digit ${i}`), String(i));
    }
    await user.click(screen.getByRole('button', { name: /verify otp|verify/i }));

    // The first digit input must still be in the DOM either during the
    // request or right after navigation; either way the page never swapped
    // itself out for an AuthLoadingScreen.
    expect(screen.queryByLabelText('Digit 1')).toBeInTheDocument();
  });
});
