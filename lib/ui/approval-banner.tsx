import Link from "next/link";

export function ApprovalBanner({ count }: { count: number }) {
  return (
    <Link
      href="/queue"
      className="flex items-center gap-3 bg-surface-elevated text-on-dark rounded-[20px] px-6 py-4 hover:opacity-90 transition-opacity"
    >
      <span className="flex-1 text-sm">
        <strong className="font-semibold">{count} action{count === 1 ? "" : "s"}</strong> waiting on your approval.
        Nothing is sent until you approve.
      </span>
      <span className="text-on-dark-mute font-medium text-sm">Review →</span>
    </Link>
  );
}
