import { PRICING_TIERS } from '../src/config/constants';

describe('Credit Aggregation & Pricing Logic', () => {
  it('should assign correct price tier based on tonnes', () => {
    const getPrice = (tonnes: number) => {
      const tier = PRICING_TIERS.find(
        (t) => tonnes >= t.minTonnes && tonnes < t.maxTonnes
      ) || PRICING_TIERS[0];
      return tier.pricePerTonne;
    };

    expect(getPrice(5)).toBe(1500);
    expect(getPrice(10)).toBe(1350);
    expect(getPrice(25)).toBe(1350);
    expect(getPrice(50)).toBe(1200);
    expect(getPrice(250)).toBe(1000);
  });

  it('should calculate correct tonnes from kg pooled', () => {
    const totalKgPooled = 4500.75;
    const totalTonnes = Math.round((totalKgPooled / 1000) * 1000) / 1000;
    expect(totalTonnes).toBe(4.501);
  });
});
