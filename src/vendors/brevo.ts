import { BrevoClient } from '@getbrevo/brevo';
import { BREVO_CLIENT } from 'src/constants';

export const brevoClient = new BrevoClient({
  apiKey: BREVO_CLIENT,
});
