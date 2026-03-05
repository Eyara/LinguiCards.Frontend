import { RoundPipe } from './round.pipe';

describe('RoundPipe', () => {
  let pipe: RoundPipe;

  beforeEach(() => {
    pipe = new RoundPipe();
  });

  it('should round to 2 decimal places by default', () => {
    expect(pipe.transform(3.14159)).toBe(3.14);
  });

  it('should round to specified decimal places', () => {
    expect(pipe.transform(3.14159, 3)).toBe(3.142);
    expect(pipe.transform(3.14159, 0)).toBe(3);
    expect(pipe.transform(3.14159, 1)).toBe(3.1);
  });

  it('should return 0 for null', () => {
    expect(pipe.transform(null)).toBe(0);
  });

  it('should return 0 for undefined', () => {
    expect(pipe.transform(undefined)).toBe(0);
  });

  it('should handle zero', () => {
    expect(pipe.transform(0)).toBe(0);
  });

  it('should handle negative numbers', () => {
    expect(pipe.transform(-3.456, 1)).toBe(-3.5);
  });

  it('should handle whole numbers', () => {
    expect(pipe.transform(5, 2)).toBe(5);
  });

  it('should round up correctly at boundary', () => {
    expect(pipe.transform(2.555, 2)).toBe(2.56);
  });
});
