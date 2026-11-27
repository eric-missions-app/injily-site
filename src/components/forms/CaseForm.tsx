'use client';

import { caseInput } from '@/lib/validation/case';
import IntakeForm from './IntakeForm';

/** The contact form on /contact: creates a Service Case with the visitor's question. */
export default function CaseForm() {
  return (
    <IntakeForm
      schema={caseInput}
      endpoint="/api/intake/case"
      submitLabel="Send message"
      message={{ label: 'Your question', required: true }}
    />
  );
}
