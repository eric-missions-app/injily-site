/** One label/value row in a `<dl>` on an admin detail page. An empty value shows as a muted dash. */
export default function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-1.5 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="col-span-2 break-words">{value || <span className="text-muted">—</span>}</dd>
    </div>
  );
}
