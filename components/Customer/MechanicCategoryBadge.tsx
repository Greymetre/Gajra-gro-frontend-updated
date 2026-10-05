import React from "react";

// Mechanic loyalty categories, best first, with the colours SFA uses for them
export const MECHANIC_CATEGORIES = ["Platinum", "Diamond", "Gold", "Silver", "Bronze"];
export const MECHANIC_CATEGORY_COLOURS: { [category: string]: string } = {
  Platinum: "#475569",
  Diamond: "#2563eb",
  Gold: "#ca8a04",
  Silver: "#8b95a5",
  Bronze: "#c2410c",
};

interface Props {
  category?: string | null;
  className?: string;
  title?: string;
}

// Pill with the mechanic's category; "Not classified" when it has none
export default function MechanicCategoryBadge({ category, className = "", title }: Props) {
  const colour = (category && MECHANIC_CATEGORY_COLOURS[category]) || "#64748b";
  return (
    <span
      className={className}
      title={title}
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        lineHeight: "18px",
        background: colour + "1f",
        color: colour,
        whiteSpace: "nowrap",
      }}
    >
      {category || "Not classified"}
    </span>
  );
}
