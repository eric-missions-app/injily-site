'use client';

import { leadInput } from '@/lib/validation/lead';
import IntakeForm from './IntakeForm';
import { referringPath } from './sourcePage';

/** The "Get early access" form on /get-started: creates a Lead, with the page the visitor came from. */
export default function LeadForm() {
  return (
    <IntakeForm
      schema={leadInput}
      endpoint="/api/intake/lead"
      submitLabel="Get early access"
      organizationLabel="Church or ministry"
      message={{ label: "Anything you'd like us to know" }}
      extraValues={() => ({ sourcePage: referringPath() })}
    />
  );
}
