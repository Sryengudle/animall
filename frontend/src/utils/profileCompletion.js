// Helpers that drive the "Complete your profile to sell" gate. We deliberately
// only require the contactable subset of profile fields — not the full 10
// fields that ProfilePage computes a completion percent from. A seller needs
// to be reachable (name + phone) and have an address buyers can use; everything
// else is a "make the profile look richer" nice-to-have.

import { hasAddress } from './addressFormat';

export const REQUIRED_SELLER_FIELDS = ['name', 'phone', 'address'];

export function getMissingSellerFields(user) {
  const missing = [];
  if (!user?.name?.trim?.()) missing.push('name');
  if (!user?.phone?.trim?.()) missing.push('phone');
  if (!hasAddress(user?.address)) missing.push('address');
  return missing;
}

export function canSell(user) {
  return getMissingSellerFields(user).length === 0;
}
