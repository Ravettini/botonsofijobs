type Status = "idle" | "running" | "success" | "error";

interface StatusBadgeProps {
  status: Status;
  /** Solo relevante cuando status === "running" */
  phase?: "waking" | "generating";
}

export function StatusBadge({ status, phase }: StatusBadgeProps) {
  if (status === "idle") {
    return (
      <span className="inline-flex items-center rounded-full bg-pink-100 px-4 py-1.5 text-base font-medium text-gray-800">
        Listo para generar
      </span>
    );
  }

  if (status === "running") {
    const label =
      phase === "waking"
        ? "Despertando sistema… (puede tardar hasta 1 min)"
        : "Generando… puede tardar varios minutos";
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-base font-medium text-gray-800">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-pink-400 border-t-transparent" />
        {label}
      </span>
    );
  }

  if (status === "success") {
    return (
      <span className="inline-flex items-center rounded-full bg-pink-100 px-4 py-1.5 text-base font-medium text-gray-800">
        Listo. Los CVs ya están en Drive.
      </span>
    );
  }

  return null;
}
