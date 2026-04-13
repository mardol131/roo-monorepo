import InputLabel from "../input-label";
import Text from "../text";
import ErrorText from "./error-text";

export function Textarea({
  label,
  inputProps,
  error,
}: {
  label: string;
  inputProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  error?: string;
}) {
  return (
    <div>
      <InputLabel label={label} isRequired={inputProps?.required} />
      <textarea
        {...inputProps}
        className={`w-full text-sm px-3 py-2.5 border bg-white ${error ? "border-red-500" : "border-zinc-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none`}
      />
      {error && <ErrorText error={error} />}
    </div>
  );
}
