import * as dateFns from 'date-fns';
import { z } from 'zod';

import { applyRequiredValidation } from './applyRequiredValidation';
import {
  addMaxDateMinAgeValidation,
  addMinDateMaxAgeValidation,
  emptyStringToUndefined,
} from './utils';
import { Field } from './types';

export const DATE_STR_REGEX_PATTERN =
  /(?<year>\d{4})[/-](?<month>\d{2})[/-](?<day>\d{2})/;

const dateParse = (dateStr: string) => {
  const match = dateStr.match(DATE_STR_REGEX_PATTERN);
  if (!match?.groups) return new Date('Invalid Date');

  const parsedDate = dateFns.parse(
    `${match.groups.year}-${match.groups.month}-${match.groups.day}`,
    'yyyy-MM-dd',
    new Date(),
  );

  if (!dateFns.isValid(parsedDate) || parsedDate.getFullYear() < 1000) {
    return new Date('Invalid Date');
  }

  return parsedDate;
};

export const dateValidator = (field: Field) => {
  const basicSchema = z.date();
  const schemaWithMaxDate = addMinDateMaxAgeValidation(basicSchema, field);
  const schemaWithMinDate = addMaxDateMinAgeValidation(
    schemaWithMaxDate,
    field,
  );
  const preprocessSchema = z
    .preprocess((val) => {
      if (typeof val === 'number') {
        return new Date(val);
      }
      if (typeof val === 'string' && DATE_STR_REGEX_PATTERN.test(val)) {
          return dateParse(val);
      }
      return val;
    }, schemaWithMinDate)
    .optional()
    .or(emptyStringToUndefined);

  return applyRequiredValidation(preprocessSchema, field);
};
