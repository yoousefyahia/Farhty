import React from "react";
export default function Pagination({ current, last, onChange }) {
  if (last <= 1) return null;

  const pages = [];

  if (current > 2) pages.push(1);
  if (current > 3) pages.push("...");

  for (let i = Math.max(1, current - 1); i <= Math.min(last, current + 1); i++) {
    pages.push(i);
  }

  if (current < last - 2) pages.push("...");
  if (current < last - 1) pages.push(last);

  return (
    <div className="flex gap-2 mt-6 justify-center">
      <button
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        السابق
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={p === current ? "font-bold" : ""}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={current === last}
        onClick={() => onChange(current + 1)}
      >
        التالي
      </button>
    </div>
  );
}
