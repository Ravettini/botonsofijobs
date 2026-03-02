"use client";

import { useMemo, useState } from "react";
import type { DayGroup, HistoryItem } from "@/lib/types";
import { groupPdfsByDay } from "@/lib/groupPdfsByDay";
import { DayCard } from "./DayCard";
import { PersonCvCard } from "./PersonCvCard";

type ViewMode = "days" | "dayDetail";

interface CvsByDateProps {
  history: HistoryItem[];
  view: ViewMode;
  selectedDayKey: string | null;
  onSelectDay: (dayKey: string) => void;
  onBack: () => void;
}

export function CvsByDate({
  history,
  view,
  selectedDayKey,
  onSelectDay,
  onBack,
}: CvsByDateProps) {
  const [search, setSearch] = useState("");

  const days = useMemo(() => groupPdfsByDay(history), [history]);

  const selectedDay = useMemo(
    () => days.find((d) => d.dayKey === selectedDayKey) ?? null,
    [days, selectedDayKey]
  );

  const filteredItems = useMemo(() => {
    if (!selectedDay) return [];
    const q = search.trim().toLowerCase();
    if (!q) return selectedDay.items;
    return selectedDay.items.filter((item) =>
      item.label.toLowerCase().includes(q)
    );
  }, [selectedDay, search]);

  if (view === "dayDetail" && selectedDay) {
    return (
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-4 rounded-lg border border-pink-200 bg-white px-4 py-2 text-base font-medium text-gray-700 hover:bg-pink-50"
        >
          Volver
        </button>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          CVs del {selectedDay.label}
        </h2>
        <div className="mb-4">
          <input
            type="search"
            placeholder="Buscar por nombre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-base text-gray-800 placeholder-gray-400"
          />
        </div>
        <ul className="flex flex-col gap-4">
          {filteredItems.length === 0 ? (
            <li className="rounded-xl border border-pink-200 bg-white p-5 text-center text-gray-600">
              {search.trim()
                ? "Ningún nombre coincide con la búsqueda."
                : "No hay CVs en este día."}
            </li>
          ) : (
            filteredItems.map((item, index) => (
              <li key={`${item.downloadUrl}-${item.createdAt ?? ""}-${index}`}>
                <PersonCvCard item={item} />
              </li>
            ))
          )}
        </ul>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <p className="rounded-xl border border-pink-200 bg-white p-8 text-center text-base text-gray-600">
        Todavía no hay CVs generados.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {days.map((day) => (
        <li key={day.dayKey}>
          <DayCard day={day} onViewDay={onSelectDay} />
        </li>
      ))}
    </ul>
  );
}
