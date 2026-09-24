import { EmissionsService } from '../src/services/emissionsService';

describe('EmissionsService Calculation Logic', () => {
  it('should correctly calculate CO2 emissions for petrol 2-wheeler', () => {
    // Distance = 10km, Congestion = 0 (optimal speed), Petrol 2W (Base Eff = 45 km/L, Emission Factor = 2.31 kg CO2/L)
    // Fuel Used = 10 / 45 = 0.2222 L
    // CO2 = 0.2222 * 2.31 = 0.5133 kg -> rounded to 0.51 kg
    const result = EmissionsService.calculateCo2Kg({
      distanceKm: 10,
      congestionScore: 0,
      vehicleType: 'petrol_2w',
    });

    expect(result.co2Kg).toBeGreaterThan(0.48);
    expect(result.co2Kg).toBeLessThan(0.55);
  });

  it('should calculate lower CO2 emissions for EV 2-wheeler than Petrol 2-wheeler', () => {
    const petrolResult = EmissionsService.calculateCo2Kg({
      distanceKm: 10,
      congestionScore: 20,
      vehicleType: 'petrol_2w',
    });

    const evResult = EmissionsService.calculateCo2Kg({
      distanceKm: 10,
      congestionScore: 20,
      vehicleType: 'ev_2w',
    });

    expect(evResult.co2Kg).toBeLessThan(petrolResult.co2Kg);
  });

  it('should score candidate routes and assign lower GRS to greenest route', () => {
    const candidates = [
      { distanceKm: 12, durationMin: 35, congestionScore: 75 },
      { distanceKm: 9.5, durationMin: 22, congestionScore: 15 },
    ];

    const scored = EmissionsService.scoreCandidateRoutes(candidates, 'petrol_2w');

    expect(scored.length).toBe(2);
    // Greenest route must be the 2nd one (shorter distance, low congestion)
    expect(scored[1].isGreenest).toBe(true);
    expect(scored[1].grsScore).toBeLessThan(scored[0].grsScore);
  });

  it('should calculate delivery CO2 baseline vs actual correctly', () => {
    const dbRoutes = [
      { id: 'route-1', grs_score: 80, co2_kg: 1.5 }, // baseline candidate (highest GRS)
      { id: 'route-2', grs_score: 30, co2_kg: 0.8 }, // green candidate
    ];

    const result = EmissionsService.calculateDeliveryCo2(dbRoutes, 'route-2');

    expect(result.baselineCo2Kg).toBe(1.5);
    expect(result.actualCo2Kg).toBe(0.8);
    expect(result.co2SavedKg).toBe(0.7);
  });
});
