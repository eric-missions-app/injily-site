import 'server-only';
import type { CaseInput } from '@/lib/validation/case';
import type { LeadInput } from '@/lib/validation/lead';
import type { Email } from '../client';

/** What every intake email is built from: the new record's id and the parsed form input. */
export type IntakeRecord = { kind: 'lead'; id: string; input: LeadInput } | { kind: 'case'; id: string; input: CaseInput };

export type RenderedEmail = Omit<Email, 'to'>;

/** A labelled line in an email. Rows without a value are left out. */
export type Row = [label: string, value: string | undefined];

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escaped, with line breaks kept. */
export function htmlText(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br>');
}

export function rowsHtml(rows: Row[]): string {
  const cells = rows
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([label, value]) => `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td>${htmlText(value)}</td></tr>`)
    .join('');
  return `<table cellpadding="4" cellspacing="0">${cells}</table>`;
}

export function rowsText(rows: Row[]): string {
  return rows
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}

/** A plain HTML document: no styles, images or tracking. */
export function htmlDocument(body: string): string {
  return `<!doctype html><html><body>${body}</body></html>`;
}
