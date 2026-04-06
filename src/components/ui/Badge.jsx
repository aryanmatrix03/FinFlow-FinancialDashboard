import { CATEGORY_META } from "../../constants";

/**
 * Badge — coloured pill showing a transaction category.
 *
 * Props:
 *   category {string} — must be a key in CATEGORY_META; falls back gracefully.
 */
export default function Badge({ category }) {
  const meta = CATEGORY_META[category] ?? { color: "#94A3B8", bg: "#94A3B818" };

  return (
    <span style={{
      background: meta.bg, color: meta.color,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
    }}>
      {category}
    </span>
  );
}
