import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import TimeInput from "@/app/components/ui/atoms/inputs/time-input";

interface DateFilterProps {
  startValue?: string;
  endValue?: string;
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  startDateInput?: React.InputHTMLAttributes<HTMLInputElement>;
  endDateInput?: React.InputHTMLAttributes<HTMLInputElement>;
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


function parseDate(iso?: string): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function parseTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function DateFilter({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  startDateInput,
  endDateInput,
}: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    parseDate(startValue) ?? new Date(),
  );
  const [startDate, setStartDate] = useState<Date | null>(parseDate(startValue));
  const [endDate, setEndDate] = useState<Date | null>(parseDate(endValue));
  const [startTime, setStartTime] = useState(parseTime(startValue) || "09:00");
  const [endTime, setEndTime] = useState(parseTime(endValue) || "17:00");
  const ref = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  // Format datetime strings for hidden inputs and callbacks
  const getDateTimeString = (date: Date | null, time: string): string => {
    if (!date) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const dateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
    );
    return dateTime.toISOString();
  };

  const startDateTimeString = getDateTimeString(startDate, startTime);
  const endDateTimeString = getDateTimeString(endDate, endTime);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    onStartChange?.(startDateTimeString);
  }, [startDate, startTime]);

  useEffect(() => {
    if (endDate) onEndChange?.(endDateTimeString);
  }, [endDate, endTime]);

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
          type="button"
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
                          type="button"
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
                          type="button"
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
              <TimeInput
                label="Začátek"
                value={startTime}
                onChange={setStartTime}
              />
              <TimeInput
                label="Konec"
                value={endTime}
                onChange={setEndTime}
                min={startTime}
              />
            </div>
          </div>
        )}
      </div>

      {/* Hidden inputs for form integration */}
      <input type="hidden" value={startDateTimeString} {...startDateInput} />
      <input type="hidden" value={endDateTimeString} {...endDateInput} />
    </div>
  );
}
