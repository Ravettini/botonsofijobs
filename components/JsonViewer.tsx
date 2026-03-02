interface JsonViewerProps {
  data: unknown;
  className?: string;
}

export function JsonViewer({ data, className = "" }: JsonViewerProps) {
  let text = "";
  try {
    text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  } catch {
    text = String(data);
  }

  return (
    <pre
      className={`json-view rounded-lg border border-pink-200 bg-gray-50 p-4 text-gray-800 ${className}`}
    >
      <code>{text}</code>
    </pre>
  );
}
