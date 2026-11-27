'use client';

import { caseInput } from '@/lib/validation/case';
import IntakeForm from './IntakeForm';

/** The contact form on /contact: creates a Service Case with the visitor's subject and message. */
export default function CaseForm() {
  return <IntakeForm schema={caseInput} endpoint="/api/intake/case" submitLabel="Send message" withSubject />;
}
