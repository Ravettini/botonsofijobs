"use client";

import type { DayGroup } from "@/lib/types";

interface DayCardProps {
  day: DayGroup;
  onViewDay: (dayKey: string) => void;
}

export function DayCard({ day, onViewDay }: DayCardProps) {
  return (
    <div className="rounded-xl border border-pink-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{day.label}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {day.totalCvs} CVs
            {day.totalErrors > 0 && ` · ${day.totalErrors} errores`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onViewDay(day.dayKey)}
          className="rounded-xl bg-pink-200 px-5 py-2.5 text-base font-medium text-gray-800 hover:bg-pink-300"
        >
          Ver CVs del día
        </button>
      </div>
    </div>
  );
}
