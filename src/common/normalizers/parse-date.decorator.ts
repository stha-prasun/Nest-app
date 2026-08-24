import { Transform } from 'class-transformer';

export function ParseDate() {
  return Transform(({ value }): Date | undefined => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  });
}
