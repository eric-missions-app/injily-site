type IconTileProps = {
  /** A Material Symbols name; add it to `icon_names` in `src/app/layout.tsx`. */
  icon: string;
};

/**
 * The 48×48 rounded, tinted icon box on the section cards. The box does the layout and sizing; the glyph span inside
 * carries only the icon class, because the icon font's own CSS overrides layout classes on it.
 */
export default function IconTile({ icon }: IconTileProps) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl text-primary">
      <span aria-hidden="true" className="material-symbols-outlined">
        {icon}
      </span>
    </span>
  );
}
