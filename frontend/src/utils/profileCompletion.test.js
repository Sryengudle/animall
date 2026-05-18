import { describe, it, expect } from 'vitest';
import { getMissingSellerFields, canSell, REQUIRED_SELLER_FIELDS } from './profileCompletion';

describe('profileCompletion util', () => {
  it('exposes the three contactable seller fields', () => {
    // Pin the contract so accidental drift (e.g. someone adding `email` here)
    // would have to update this test deliberately.
    expect(REQUIRED_SELLER_FIELDS).toEqual(['name', 'phone', 'address']);
  });

  describe('getMissingSellerFields', () => {
    it('returns all three when user is null', () => {
      expect(getMissingSellerFields(null)).toEqual(['name', 'phone', 'address']);
    });

    it('returns all three for an empty user object', () => {
      expect(getMissingSellerFields({})).toEqual(['name', 'phone', 'address']);
    });

    it('treats whitespace-only strings as missing', () => {
      // Trim guard exists specifically because users in the field tend to enter
      // spaces in form fields and the server stores them verbatim.
      expect(getMissingSellerFields({ name: '   ', phone: '   ', address: {} })).toEqual([
        'name', 'phone', 'address',
      ]);
    });

    it('only flags actually-missing fields', () => {
      const user = {
        name: 'Suresh',
        phone: '9999999999',
        address: { city: 'Pune' }, // hasAddress treats city as sufficient
      };
      expect(getMissingSellerFields(user)).toEqual([]);
    });

    it('keeps partial completeness — only what is missing', () => {
      // Phone is the only thing missing; the util should not flag name or
      // address. This is what drives the missing-fields list in the gate card.
      const user = { name: 'Suresh', address: { pincode: '411038' } };
      expect(getMissingSellerFields(user)).toEqual(['phone']);
    });

    it('treats an address with only lat/lng (no human label) as missing', () => {
      // hasAddress requires at least one of pincode/city/area/district to count.
      // A bare GPS pin is not enough for a buyer to figure out where to go.
      const user = {
        name: 'Suresh',
        phone: '9999999999',
        address: { lat: 18.5, lng: 73.8 },
      };
      expect(getMissingSellerFields(user)).toEqual(['address']);
    });
  });

  describe('canSell', () => {
    it('returns false when anything is missing', () => {
      expect(canSell({ name: 'Suresh', phone: '9999999999' })).toBe(false);
    });

    it('returns true when the contactable subset is complete', () => {
      expect(canSell({
        name: 'Suresh',
        phone: '9999999999',
        address: { pincode: '411038' },
      })).toBe(true);
    });

    it('returns false for null', () => {
      expect(canSell(null)).toBe(false);
    });
  });
});
