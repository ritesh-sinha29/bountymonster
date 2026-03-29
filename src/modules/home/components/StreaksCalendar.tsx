"use client";

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
    <div className="relative bg-black rounded-xl p-4 border border-white/20 shadow-2xl overflow-hidden group shrink-0">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-primary rounded-b-full shadow-[0_0_20px_2px_hsl(var(--primary)/0.8)] z-10" />

      <div className="mb-2 text-center">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
          Streaks: {user?.streaks || 0}
        </span>
      </div>

      <div className="flex justify-center -mx-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-0"
          weekStartsOn={1}
          showOutsideDays={true}
          formatters={{
            formatWeekdayName: (date) =>
              date
                .toLocaleDateString("en-US", { weekday: "short" })
                .toUpperCase(),
          }}
          classNames={{
            months: "w-full",
            month: "w-full space-y-1",
            month_caption:
              "flex justify-center relative items-center h-8 mb-2",
            caption_label:
              "text-xs font-black text-white tracking-[0.2em] uppercase",
            nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between pointer-events-none px-1 h-8",
            button_previous:
              "h-8 w-8 bg-white/[0.03] hover:bg-white/[0.08] p-0 opacity-40 hover:opacity-100 rounded-full border border-white/5 pointer-events-auto transition-all duration-300",
            button_next:
              "h-8 w-8 bg-white/[0.03] hover:bg-white/[0.08] p-0 opacity-40 hover:opacity-100 rounded-full border border-white/5 pointer-events-auto transition-all duration-300",
            table: "w-full border-collapse",
            weekdays: "flex w-full justify-between mb-2 px-1",
            weekday:
              "text-white/20 w-8 font-extrabold text-[9px] uppercase tracking-widest text-center",
            week: "flex w-full mt-1 justify-between",
            day: "h-8 w-8 text-center text-sm p-0 relative focus-within:z-20 transition-all",
            today: "bg-white/5 rounded-full text-primary font-extrabold",
            outside: "text-white/5 opacity-20",
            day_button: cn(
              "h-8 w-8 p-0 font-medium rounded-full transition-all duration-300 text-white/70 hover:bg-white/5 hover:text-white flex items-center justify-center relative",
              "aria-selected:bg-primary! aria-selected:text-black! aria-selected:font-black aria-selected:shadow-[0_0_20px_hsl(var(--primary)/0.8)] aria-selected:scale-110",
            ),
          }}
          modifiers={{
            streak: (d) => checkDate(d, loginDates),
          }}
          modifiersClassNames={{
            streak: "bg-primary/20! text-primary! font-bold",
          }}
        />
      </div>
    </div>
  );
};
