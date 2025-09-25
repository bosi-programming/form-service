import { ZodError } from 'zod';
import { Field } from './types';
import { phoneValidator } from './phone';

const createPhoneField = ({ ...props }: Partial<Field>): Field => ({
  key: 'testPhoneField',
  validator: 'phone',
  required: true,
  ...props,
});
const basicField = createPhoneField({});
const basicValidator = phoneValidator(basicField);

describe('phoneValidator', () => {
  it('should be valid', () => {
    const phoneNumber = '+12242222222';
    expect(basicValidator.parse(phoneNumber)).toBe(phoneNumber);
  });
  it('should be invalid', () => {
    const phoneNumber = '1231231231';
    try {
      basicValidator.parse(phoneNumber);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(ZodError);
      const zodMessage = (
        JSON.parse((e as ZodError).message) as Record<string, string>[]
      )[0].message;
      expect(zodMessage).toBe('Invalid phone');
    }
  });
});
