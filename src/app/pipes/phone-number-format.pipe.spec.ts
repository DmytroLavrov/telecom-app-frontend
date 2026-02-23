import { PhoneNumberFormatPipe } from '@pipes/phone-number-format.pipe';

describe('PhoneNumberFormatPipe', () => {
  let pipe: PhoneNumberFormatPipe;

  beforeEach(() => {
    pipe = new PhoneNumberFormatPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format a valid 10-digit number correctly (TC-09)', () => {
    const result = pipe.transform('0501234567');
    expect(result).toBe('+38 (050) 123-45-67');
  });

  it('should clean non-digit characters and format correctly (TC-10)', () => {
    // Even if the user entered a number with hyphens or spaces
    const result = pipe.transform('067-111 22-33');
    expect(result).toBe('+38 (067) 111-22-33');
  });

  it('should return the original string if it is too short (TC-11)', () => {
    const result = pipe.transform('12345');
    expect(result).toBe('12345');
  });

  it('should return the original string if it is too long', () => {
    const result = pipe.transform('050123456789');
    expect(result).toBe('050123456789');
  });

  it('should return the original value if it is empty or falsy (TC-12)', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });
});
