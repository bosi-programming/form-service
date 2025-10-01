export const Validators = {
  NUMBER: 'number',
  STRING: 'string',
  BOOLEAN: 'boolean',
  PHONE: 'phone',
  DATE: 'date',
  EMAIL: 'email',
} as const;
export type Validators = (typeof Validators)[keyof typeof Validators];

export interface Field {
  key: string;
  validator: Validators;
  required?: boolean;
  min?: number;
  max?: number;
  minAge?: number;
  maxAge?: number;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  minDate?: string | 'CURRENT_DATE';
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  maxDate?: string | 'CURRENT_DATE' | 'FUTURE_DATE';
}
