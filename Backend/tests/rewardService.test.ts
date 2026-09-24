import { REWARD_RATE_INR_PER_KG, MIN_CO2_THRESHOLD_KG } from '../src/config/constants';

describe('Reward Calculation Math', () => {
  it('should calculate reward as co2SavedKg * 8.5 when above 0.05kg threshold', () => {
    const co2SavedKg = 1.0;
    const rewardInr = co2SavedKg * REWARD_RATE_INR_PER_KG;
    expect(rewardInr).toBe(8.5);
  });

  it('should evaluate threshold correctly', () => {
    const lowCo2 = 0.03;
    const highCo2 = 0.12;

    expect(lowCo2 >= MIN_CO2_THRESHOLD_KG).toBe(false);
    expect(highCo2 >= MIN_CO2_THRESHOLD_KG).toBe(true);
  });
});
