import { ZodError } from 'zod';
import { numberValidator } from './number';
import { Field } from './types';

const createNumberField = ({ ...props }: Partial<Field>): Field => ({
  key: 'testNumberField',
  validator: 'number',
  required: true,
  ...props,
});

const min = 10;
const max = 200;
const basicField = createNumberField({ min, max });
const basicValidator = numberValidator(basicField);

describe('Zod numberValidator', () => {
  it('should return valid for any number bellow max and above min', () => {
    expect(basicValidator.parse(42)).toBe(42);
    expect(basicValidator.parse(100)).toBe(100);
  });
  it('should return invalid for any number above max or bellow min', () => {
    try {
      basicValidator.parse(1);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(ZodError);
      const zodMessage = (
        JSON.parse((e as ZodError).message) as Record<string, string>[]
      )[0].message;
      expect(zodMessage).toBe(`Must be at least ${min}`);
    }
    try {
      basicValidator.parse(1000);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(ZodError);
      const zodMessage = (
        JSON.parse((e as ZodError).message) as Record<string, string>[]
      )[0].message;
      expect(zodMessage).toBe(`Must be at most ${max}`);
    }
  });
  it('should return invalid for non number', () => {
    try {
      basicValidator.parse('test');
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(ZodError);
      const zodMessage = (
        JSON.parse((e as ZodError).message) as Record<string, string>[]
      )[0].message;
      expect(zodMessage).toBe('Invalid input');
    }
    try {
      basicValidator.parse(null);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(ZodError);
      const zodMessage = (
        JSON.parse((e as ZodError).message) as Record<string, string>[]
      )[0].message;
      expect(zodMessage).toBe('Invalid input');
    }
    try {
      basicValidator.parse(undefined);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(ZodError);
      const zodMessage = (
        JSON.parse((e as ZodError).message) as Record<string, string>[]
      )[0].message;
      expect(zodMessage).toBe('Required');
    }
    try {
      basicValidator.parse(true);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(ZodError);
      const zodMessage = (
        JSON.parse((e as ZodError).message) as Record<string, string>[]
      )[0].message;
      expect(zodMessage).toBe('Invalid input');
    }
  });

  it('should return invalid for empty string', () => {
    try {
      basicValidator.parse('');
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(ZodError);
      const zodMessage = (
        JSON.parse((e as ZodError).message) as Record<string, string>[]
      )[0].message;
      expect(zodMessage).toBe('Required');
    }
  });
});
