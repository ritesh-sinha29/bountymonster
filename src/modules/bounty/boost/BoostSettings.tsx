"use client";

import React from "react";
import { 
  Rocket, 
  Calendar as CalendarIcon 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface BoostSettingsProps {
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
}

export function BoostSettings({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: BoostSettingsProps) {
  return (
    <Card className="border-white/10 bg-white/2 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          <Rocket className="h-4 w-4 text-primary" />
          Boost Settings
        </CardTitle>
        <CardDescription>
          Select the timeframe you want to feature your bounty.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start date */}
          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold tracking-widest text-white/50">
              Start Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-white/10 bg-white/5 hover:bg-white/10",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-white/10 bg-black/90"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(d) => {
                    if (d) {
                      setStartDate(d);
                      // If new start date is after current end date, push end date forward
                      if (isBefore(endDate, d)) {
                        setEndDate(addDays(d, 1));
                      }
                    }
                  }}
                  disabled={(d) =>
                    isBefore(d, startOfDay(new Date()))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold tracking-widest text-white/50">
              End Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-white/10 bg-white/5 hover:bg-white/10",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-white/10 bg-black/90"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(d) => d && setEndDate(d)}
                  disabled={(d) =>
                    isBefore(d, addDays(startDate, 1))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <p className="text-[11px] text-white/30 font-medium italic">
          * Minimum boost duration is 1 day.
        </p>
      </CardContent>
    </Card>
  );
}
