import { DurationFormatPipe } from '@pipes/duration-format.pipe';

describe('DurationFormatPipe', () => {
  let pipe: DurationFormatPipe;

  beforeEach(() => {
    pipe = new DurationFormatPipe();
  });

  it('create an instance (TC-00)', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform 3665 seconds to "1h 1min 5sec" (TC-01)', () => {
    const result = pipe.transform(3665);
    expect(result).toBe('1h 1min 5sec');
  });

  it('should transform 0 seconds to "0h 0min 0sec" (TC-02)', () => {
    const result = pipe.transform(0);
    expect(result).toBe('0h 0min 0sec');
  });

  // Additional test to check for boundary values
  it('should transform 59 seconds to "0h 0min 59sec"', () => {
    const result = pipe.transform(59);
    expect(result).toBe('0h 0min 59sec');
  });

  it('should return "0h 0min 0sec" for negative duration (TC-41)', () => {
    const result = pipe.transform(-65);
    expect(result).toBe('0h 0min 0sec');
  });
});
