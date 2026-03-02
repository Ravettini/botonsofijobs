type Status = "idle" | "running" | "success" | "error";

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "idle") {
    return (
      <span className="inline-flex items-center rounded-full bg-pink-100 px-4 py-1.5 text-base font-medium text-gray-800">
        Listo para generar
      </span>
    );
  }

  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-base font-medium text-gray-800">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-pink-400 border-t-transparent" />
        Generando… puede tardar varios minutos
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

  return (
    <span className="inline-flex items-center rounded-full bg-error-soft px-4 py-1.5 text-base font-medium text-error-soft-text">
      Hubo un problema. Reintentá
    </span>
  );
}
