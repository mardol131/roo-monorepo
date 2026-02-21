import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";

interface DateFilterProps {
  value: string;
  onChange: (value: string) => void;
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
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");

  // Limit to 4 digits (HHMM)
  if (digits.length === 0) return "";
  if (digits.length <= 2) return digits;
  if (digits.length === 3) return `${digits.slice(0, 2)}:${digits[2]}`;
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
};

const isValidTime = (value: string): boolean => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(value);
};

export default function DateFilter({ value, onChange }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const ref = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = (month: Date) => {
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const firstDayMonday = firstDay === 0 ? 6 : firstDay - 1;
    const days = [];

    // Empty cells
    for (let i = 0; i < firstDayMonday; i++) {
      days.push(null);
    }

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(month.getFullYear(), month.getMonth(), i));
    }

    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const start = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    );
    const end = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
    );
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return d >= start && d <= end;
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const isDateSelected = (date: Date) => {
    const dateStr = date.toDateString();
    return (
      startDate?.toDateString() === dateStr ||
      endDate?.toDateString() === dateStr
    );
  };

  const displayText =
    startDate && endDate
      ? `${startDate.toLocaleDateString("cs-CZ")} ${startTime} - ${endDate.toLocaleDateString("cs-CZ")} ${endTime}`
      : startDate
        ? `Od: ${startDate.toLocaleDateString("cs-CZ")} ${startTime}`
        : "Vyberte datum";

  const nextMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="relative" ref={ref}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white text-left flex items-center justify-between"
        >
          <span className="text-zinc-900">{displayText}</span>
          <Calendar className="w-4 h-4 text-zinc-400" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-zinc-200 rounded-lg shadow-lg z-10 w-fit">
            <div className="grid grid-cols-2 gap-6 p-4">
              {/* Start month */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
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
                    {MONTHS[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </h3>
                </div>

                {/* Days header */}
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

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar(currentMonth).map((date, index) => (
                    <div key={index} className="w-8 h-8">
                      {date ? (
                        <button
                          onClick={() => handleDateClick(date)}
                          className={`w-full h-full rounded text-xs font-medium transition-colors ${
                            isDateSelected(date)
                              ? "bg-rose-500 text-white"
                              : isDateInRange(date)
                                ? "bg-rose-100 text-rose-900"
                                : "hover:bg-zinc-100 text-zinc-900"
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              {/* Next month */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-zinc-900">
                    {MONTHS[nextMonth.getMonth()]} {nextMonth.getFullYear()}
                  </h3>
                  <button
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

                {/* Days header */}
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

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar(nextMonth).map((date, index) => (
                    <div key={index} className="w-8 h-8">
                      {date ? (
                        <button
                          onClick={() => handleDateClick(date)}
                          className={`w-full h-full rounded text-xs font-medium transition-colors ${
                            isDateSelected(date)
                              ? "bg-rose-500 text-white"
                              : isDateInRange(date)
                                ? "bg-rose-100 text-rose-900"
                                : "hover:bg-zinc-100 text-zinc-900"
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Times */}
            <div className="border-t border-zinc-100 p-4 grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-zinc-900">
                  Začátek
                </label>
                <input
                  type="text"
                  placeholder="09:00"
                  value={startTime}
                  onChange={(e) => {
                    const formatted = formatTimeInput(e.target.value);
                    setStartTime(formatted);
                  }}
                  maxLength={5}
                  className={`px-2 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                    isValidTime(startTime) || startTime === ""
                      ? "border-zinc-200"
                      : "border-red-500"
                  }`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-zinc-900">
                  Konec
                </label>
                <input
                  type="text"
                  placeholder="17:00"
                  value={endTime}
                  onChange={(e) => {
                    const formatted = formatTimeInput(e.target.value);
                    setEndTime(formatted);
                  }}
                  maxLength={5}
                  className={`px-2 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                    isValidTime(endTime) || endTime === ""
                      ? "border-zinc-200"
                      : "border-red-500"
                  }`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
