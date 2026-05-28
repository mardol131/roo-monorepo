"use client";

import { useClickOutside } from "@/app/hooks/use-click-outside";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import InputLabel from "../input-label";
import ErrorText from "./error-text";
import TimeInput from "./time-input";

interface DateTimeInputProps {
  label: string;
  sublabel?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  min?: string;
  max?: string;
  containerRef?: React.Ref<HTMLDivElement>;
  placeholder?: string;
  isRequired?: boolean;
  error?: string;
}

const DAYS_OF_WEEK = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

const MONTHS = [
  "Leden",
  "Únor",
  "Březen",
  "Duben",
  "Květen",
  "Červen",
  "Červenec",
  "Srpen",
  "Září",
  "Říjen",
  "Listopad",
  "Prosinec",
];

const isValidTime = (value: string): boolean => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(value);
};

export default function DateTimeInput({
  label,
  sublabel,
  value = null,
  onChange,
  min,
  max,
  placeholder = "Vyberte datum a čas",
  error,
  isRequired,
  containerRef,
}: DateTimeInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    value ? new Date(value) : new Date(),
  );
  const [selectedDateState, setSelectedDateState] = useState<string | null>(
    value,
  );
  const [time, setTime] = useState<string>(
    value
      ? new Date(value).toLocaleTimeString("cs-CZ", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "09:00",
  );

  const ref = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useClickOutside(ref, () => {
    setIsOpen(false);
  });

  const createDateTimeValue = (
    date: Date | null,
    time: string,
  ): Date | null => {
    if (!date || !isValidTime(time)) return null;

    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);

    return newDate;
  };

  // Emit změny ven — přeskočí mount, aby onChange nevolal null při inicializaci
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const dateObj = createDateTimeValue(
      selectedDateState ? new Date(selectedDateState) : null,
      time,
    );
    onChange?.(dateObj ? dateObj.toISOString() : null);
  }, [selectedDateState, time]);

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const renderCalendar = (month: Date) => {
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const firstDayMonday = firstDay === 0 ? 6 : firstDay - 1;

    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDayMonday; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(month.getFullYear(), month.getMonth(), i));
    }

    return days;
  };

  const isDateSelected = (date: Date) =>
    selectedDateState ? isSameDay(new Date(selectedDateState), date) : false;

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const minTimeString = min
    ? `${String(new Date(min).getHours()).padStart(2, "0")}:${String(new Date(min).getMinutes()).padStart(2, "0")}`
    : null;

  const maxTimeString = max
    ? `${String(new Date(max).getHours()).padStart(2, "0")}:${String(new Date(max).getMinutes()).padStart(2, "0")}`
    : null;

  const isTimeBelowMin = (timeStr: string, date: Date | null): boolean => {
    if (!min || !date || !minTimeString || !isSameDay(date, new Date(min)))
      return false;
    if (!isValidTime(timeStr)) return false;
    const [h, m] = timeStr.split(":").map(Number);
    const minDate = new Date(min);
    return (
      h < minDate.getHours() ||
      (h === minDate.getHours() && m < minDate.getMinutes())
    );
  };

  const isTimeAboveMax = (timeStr: string, date: Date | null): boolean => {
    if (!max || !date || !maxTimeString || !isSameDay(date, new Date(max)))
      return false;
    if (!isValidTime(timeStr)) return false;
    const [h, m] = timeStr.split(":").map(Number);
    const maxDate = new Date(max);
    return (
      h > maxDate.getHours() ||
      (h === maxDate.getHours() && m > maxDate.getMinutes())
    );
  };

  const isDateDisabled = (date: Date) => {
    const checkDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    if (min) {
      const minDate = new Date(min);
      const minDateOnly = new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate(),
      );
      if (checkDate < minDateOnly) return true;
    }
    if (max) {
      const maxDate = new Date(max);
      const maxDateOnly = new Date(
        maxDate.getFullYear(),
        maxDate.getMonth(),
        maxDate.getDate(),
      );
      if (checkDate > maxDateOnly) return true;
    }
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      setSelectedDateState(date.toISOString());
      if (
        min &&
        isSameDay(date, new Date(min)) &&
        isValidTime(time) &&
        isTimeBelowMin(time, date)
      ) {
        setTime(minTimeString!);
      } else if (
        max &&
        isSameDay(date, new Date(max)) &&
        isValidTime(time) &&
        isTimeAboveMax(time, date)
      ) {
        setTime(maxTimeString!);
      }
    }
  };

  const handleTimeChange = (value: string) => {
    const date = selectedDateState ? new Date(selectedDateState) : null;
    if (isTimeBelowMin(value, date)) {
      setTime(minTimeString!);
    } else if (isTimeAboveMax(value, date)) {
      setTime(maxTimeString!);
    } else {
      setTime(value);
    }
  };

  const timeMin =
    selectedDateState &&
    min &&
    isSameDay(new Date(selectedDateState), new Date(min))
      ? (minTimeString ?? undefined)
      : undefined;

  const timeMax =
    selectedDateState &&
    max &&
    isSameDay(new Date(selectedDateState), new Date(max))
      ? (maxTimeString ?? undefined)
      : undefined;

  const displayText =
    selectedDateState && time
      ? `${new Date(selectedDateState).toLocaleDateString("cs-CZ")} ${time}`
      : placeholder;

  return (
    <div ref={containerRef} className="flex flex-col w-full">
      {label && (
        <InputLabel label={label} isRequired={isRequired} sublabel={sublabel} />
      )}
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => {
            if (!isOpen && ref.current) {
              const rect = ref.current.getBoundingClientRect();
              setOpenUpward(rect.bottom + 320 > window.innerHeight);
            }
            setIsOpen((prev) => !prev);
          }}
          className={`w-full px-3 py-2.5 border ${error ? "border-rose-500" : "border-zinc-200"} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white text-left flex items-center justify-between`}
        >
          <span className="text-zinc-900">{displayText}</span>
          <Calendar className="w-4 h-4 text-zinc-400" />
        </button>

        {isOpen && (
          <div
            className={`absolute left-0 bg-white border border-zinc-200 rounded-lg shadow-lg z-10 w-fit ${openUpward ? "bottom-full mb-2" : "top-full mt-2"}`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1,
                      ),
                    )
                  }
                  className="p-1 hover:bg-zinc-50 rounded"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <h3 className="text-sm font-medium text-zinc-900">
                  {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                      ),
                    )
                  }
                  className="p-1 hover:bg-zinc-50 rounded"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className="w-8 h-8 flex items-center justify-center text-xs font-medium text-zinc-600"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 mb-4">
                {renderCalendar(currentMonth).map((date, index) => (
                  <div key={index} className="w-8 h-8">
                    {date && (
                      <button
                        type="button"
                        onClick={() => handleDateClick(date)}
                        disabled={isDateDisabled(date)}
                        className={`w-full h-full rounded text-xs font-medium ${
                          isDateDisabled(date)
                            ? "text-text-light cursor-not-allowed line-through"
                            : isDateSelected(date)
                              ? "bg-rose-500 text-white"
                              : "hover:bg-zinc-100 text-zinc-900"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <TimeInput
                  label="Čas"
                  value={time}
                  onChange={handleTimeChange}
                  min={timeMin}
                  max={timeMax}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {error && <ErrorText error={error} />}
    </div>
  );
}
