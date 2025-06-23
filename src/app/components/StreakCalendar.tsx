"use client";
import { useState, useEffect } from "react";

interface DayData {
  date: string;
  count: number;
}

export default function StreakCalendar() {
  const [calendarData, setCalendarData] = useState<DayData[]>([]);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      const response = await fetch("/api/checkin/calendar");
      const data = await response.json();
      setCalendarData(data.calendar || []);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-gray-800";
    if (count <= 2) return "bg-green-900";
    if (count <= 4) return "bg-green-700";
    if (count <= 6) return "bg-green-500";
    return "bg-green-400";
  };

  // Generate last 365 days
  const generateCalendar = () => {
    const calendar = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayData = calendarData.find((d) => d.date === dateStr);
      calendar.push({
        date: dateStr,
        count: dayData?.count || 0,
        dayOfWeek: date.getDay(),
      });
    }

    return calendar;
  };

  const calendar = generateCalendar();
  const weeks = [];

  // Group by weeks
  for (let i = 0; i < calendar.length; i += 7) {
    weeks.push(calendar.slice(i, i + 7));
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-x-auto">
      <div className="flex space-x-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col space-y-1">
            {week.map((day) => (
              <div
                key={day.date}
                className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-125 ${getIntensityClass(
                  day.count
                )}`}
                onMouseEnter={() => setHoveredDay(day.date)}
                onMouseLeave={() => setHoveredDay(null)}
                title={`${day.date}: ${day.count} activities`}
              />
            ))}
          </div>
        ))}
      </div>

      {hoveredDay && (
        <div className="mt-4 text-sm text-gray-400">
          {hoveredDay}:{" "}
          {calendarData.find((d) => d.date === hoveredDay)?.count || 0}{" "}
          activities
        </div>
      )}

      <div className="mt-4 flex items-center justify-end space-x-2 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex space-x-1">
          {[0, 2, 4, 6, 8].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getIntensityClass(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
