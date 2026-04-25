type Tab<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  tabs: Tab<T>[];
  activeTab: T;
  onChange: (value: T) => void;
  className?: string;
};

export default function TabFilter<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: Props<T>) {
  return (
    <div
      className={`flex items-center gap-1 p-1 bg-zinc-100 border border-zinc-200 rounded-xl w-fit ${className ?? ""}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`px-4 cursor-pointer py-1.5 text-sm font-medium rounded-lg transition-colors ${
            activeTab === tab.value
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
