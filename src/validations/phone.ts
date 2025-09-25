import { z } from 'zod';

import { applyRequiredValidation } from './applyRequiredValidation';
import { Field } from './types';
import { emptyStringToUndefined } from './utils';

export const phoneValidator = (field: Field) => {
  const schema = z
    .e164({ error: 'Invalid phone' })
    .optional()
    .or(emptyStringToUndefined);

  return applyRequiredValidation(schema, field);
};
