"use client";

import { Zap, ZapIcon } from "lucide-react";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const StreaksCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const user = useQuery(api.users.getCurrentUser);
  const dailyLogins = useQuery(api.users.getMyDailyLogins) || [];

  const loginDates = dailyLogins.map((login: any) => new Date(login.timestamp));

  const checkDate = (day: Date, list: Date[]) =>
    list.some(
      (d) =>
        d.getDate() === day.getDate() &&
        d.getMonth() === day.getMonth() &&
        d.getFullYear() === day.getFullYear(),
    );

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3 px-6 border-b border-white/5">
        <span className="text-base capitalize text-white tracking-wide">
          <ZapIcon className="text-primary inline w-5 h-5 mr-2" />
          Streaks
        </span>

        <span className="text-base font-medium text-white/80">
          {user?.streaks || 0}
        </span>
      </div>

      {/* Calendar */}
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        weekStartsOn={1}
        showOutsideDays={true}
        className="w-full"
        formatters={{
          formatWeekdayName: (date) =>
            date.toLocaleDateString("en-US", { weekday: "short" }),
        }}
        classNames={{
          months: "w-full",
          month: "w-full",
          month_caption: "flex justify-center items-center h-8 mb-1",
          caption_label: "text-xs font-medium text-white/70",
          nav: "absolute inset-x-0 top-0 flex items-center justify-between px-2 h-8",
          button_previous: "h-6 w-6 text-white/40 hover:text-white transition",
          button_next: "h-6 w-6 text-white/40 hover:text-white transition",
          table: "w-full border-collapse",
          weekdays: "flex w-full justify-between px-1 mb-1",
          weekday: "w-8 text-[10px] text-white/30 text-center",
          week: "flex w-full justify-between",
          day: "h-8 w-8 text-sm text-center p-0",
          outside: "text-white/10",
          today: "text-white",
          day_button: cn(
            "h-8 w-8 flex items-center justify-center rounded-md text-white/70 hover:bg-white/5 hover:text-white transition",
            "aria-selected:bg-white/10 aria-selected:text-white aria-selected:font-medium",
          ),
        }}
        modifiers={{
          streak: (d) => checkDate(d, loginDates),
        }}
        modifiersClassNames={{
          streak: "text-white font-medium",
        }}
      />
    </div>
  );
};
