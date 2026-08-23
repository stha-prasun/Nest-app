import { Transform } from 'class-transformer';

export function Trim() {
  return Transform(({ value }): string => {
    if (typeof value !== 'string') return value;
    return value.trim();
  });
}
