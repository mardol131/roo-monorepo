"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import { useClickOutside } from "@/app/hooks/use-click-outside";
import ErrorText from "./error-text";

interface DateTimeInputProps {
  label: string;
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  min?: Date;
  placeholder?: string;
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

const formatTimeInput = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) return "";
  if (digits.length <= 2) return digits;
  if (digits.length === 3) return `${digits.slice(0, 2)}:${digits[2]}`;
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
};

const isValidTime = (value: string): boolean => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(value);
};

export default function DateTimeInput({
  label,
  value = null,
  onChange,
  min,
  placeholder = "Vyberte datum a čas",
  error,
}: DateTimeInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(value ?? new Date());
  const [selectedDateState, setSelectedDateState] = useState<Date | null>(
    value,
  );
  const [time, setTime] = useState<string>(
    value
      ? value.toLocaleTimeString("cs-CZ", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "09:00",
  );

  const ref = useRef<HTMLDivElement>(null);

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

  // Emit změny ven
  useEffect(() => {
    const dateObj = createDateTimeValue(selectedDateState, time);
    onChange?.(dateObj);
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
    selectedDateState?.toDateString() === date.toDateString();

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const minTimeString = min
    ? `${String(min.getHours()).padStart(2, "0")}:${String(min.getMinutes()).padStart(2, "0")}`
    : null;

  const isTimeBelowMin = (timeStr: string, date: Date | null): boolean => {
    if (!min || !date || !minTimeString || !isSameDay(date, min)) return false;
    if (!isValidTime(timeStr)) return false;
    const [h, m] = timeStr.split(":").map(Number);
    return h < min.getHours() || (h === min.getHours() && m < min.getMinutes());
  };

  const isDateDisabled = (date: Date) => {
    if (!min) return false;

    const minDate = new Date(min.getFullYear(), min.getMonth(), min.getDate());
    const checkDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    return checkDate < minDate;
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      setSelectedDateState(date);
      if (
        min &&
        isSameDay(date, min) &&
        isValidTime(time) &&
        isTimeBelowMin(time, date)
      ) {
        setTime(minTimeString!);
      }
    }
  };

  const handleTimeChange = (rawValue: string) => {
    const formatted = formatTimeInput(rawValue);
    if (
      isValidTime(formatted) &&
      isTimeBelowMin(formatted, selectedDateState)
    ) {
      setTime(minTimeString!);
    } else {
      setTime(formatted);
    }
  };

  const displayText =
    selectedDateState && time
      ? `${selectedDateState.toLocaleDateString("cs-CZ")} ${time}`
      : placeholder;

  return (
    <div className="flex flex-col gap-2 w-full">
      <label>
        <Text variant="label2" color="dark" className="font-semibold">
          {label}
        </Text>
      </label>

      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white text-left flex items-center justify-between"
        >
          <span className="text-zinc-900">{displayText}</span>
          <Calendar className="w-4 h-4 text-zinc-400" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-zinc-200 rounded-lg shadow-lg z-10 w-fit">
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
                            ? "text-zinc-300 cursor-not-allowed"
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

              <div className="border-t flex gap-2 items-center border-zinc-100 pt-4">
                <label className="text-xs font-medium text-zinc-900">Čas</label>
                <input
                  type="text"
                  placeholder="09:00"
                  value={time}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  maxLength={5}
                  className="px-2 py-1.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
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
