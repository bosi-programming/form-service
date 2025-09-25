import { ZodOptional, type ZodType } from 'zod';

import { Field } from './types';

export const validateRequired = (data: unknown): boolean => {
  if (typeof data === 'number') {
    return !isNaN(data);
  } else if (typeof data === 'boolean') {
    return true;
  }
  return !!data;
};

const applyNotRequiredRefinement = <Output, Input>(
  schema: ZodType<Output, Input>,
) => {
  return schema.nullish().optional();
};

const applyRequiredRefinement = <Output, Input>(
  schema: ZodType<Output, Input>,
) => {
  return schema.refine(
    (data) => {
      return validateRequired(data);
    },
    {
      message: 'Required',
    },
  );
};

export const applyRequiredValidation = <Output, Input>(
  schema: ZodType<Output, Input>,
  field: Field,
): ZodType<Output, Input> | ZodOptional => {
  if (field.required) {
    return applyRequiredRefinement(schema);
  }

  return applyNotRequiredRefinement(schema);
};
