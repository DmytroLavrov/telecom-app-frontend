import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberFormat',
})
export class PhoneNumberFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    const cleaned = value.replace(/\D/g, '');

    const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+38 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
    }

    return value;
  }
}
