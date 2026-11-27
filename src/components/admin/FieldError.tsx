'use client';

import { useContext } from 'react';
import { ActionStateContext } from './ActionForm';

/**
 * The validation message for one field of the surrounding `ActionForm`, from the action's `fieldErrors`. Always
 * rendered (empty when there's no error) so the field's `aria-describedby` points at it.
 */
export default function FieldError({ name }: { name: string }) {
  const state = useContext(ActionStateContext);
  const message = state.status === 'error' ? state.fieldErrors?.[name] : undefined;
  return (
    <p id={`${name}-error`} className="text-xs text-danger">
      {message}
    </p>
  );
}
