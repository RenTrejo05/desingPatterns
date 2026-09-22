interface StatusMessageProps {
  message: string | null;
  tone: "success" | "error";
}

export default function StatusMessage({ message, tone }: StatusMessageProps) {
  if (!message) return null;
  return <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${tone === "success" ? "border-[#a9d1c3] bg-[#e5f0ed] text-[var(--teal-dark)]" : "border-[#e6b8ad] bg-[#f6e4df] text-[#914337]"}`} role="status">{message}</div>;
}
