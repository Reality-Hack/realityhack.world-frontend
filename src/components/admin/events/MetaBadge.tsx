export default function MetaBadge({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
      {children}
    </span>
  );
}
