type Props = {
  checked: boolean;
  disabled?: boolean;
  onEnable: () => void;
  onDisable: () => void;
};

export default function Switch({
  checked,
  disabled,
  onEnable,
  onDisable,
}: Props) {
  return (
    <button
      role="switch"
      type="button"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => (checked ? onDisable() : onEnable())}
      className={`ml-4 shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${checked ? "bg-success" : "bg-zinc-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}
