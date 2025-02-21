
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface DateRangeFilterProps {
  onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

type PresetOption = {
  label: string;
  getValue: () => { from: Date; to: Date };
};

export const DateRangeFilter = ({ onDateChange }: DateRangeFilterProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);

  const presets: PresetOption[] = [
    {
      label: "Today",
      getValue: () => ({
        from: new Date(),
        to: new Date(),
      }),
    },
    {
      label: "Yesterday",
      getValue: () => {
        const yesterday = subDays(new Date(), 1);
        return { from: yesterday, to: yesterday };
      },
    },
    {
      label: "Last 7 days",
      getValue: () => ({
        from: subDays(new Date(), 6),
        to: new Date(),
      }),
    },
    {
      label: "Last 14 days",
      getValue: () => ({
        from: subDays(new Date(), 13),
        to: new Date(),
      }),
    },
    {
      label: "Last 30 days",
      getValue: () => ({
        from: subDays(new Date(), 29),
        to: new Date(),
      }),
    },
    {
      label: "This week",
      getValue: () => ({
        from: startOfWeek(new Date(), { weekStartsOn: 1 }),
        to: endOfWeek(new Date(), { weekStartsOn: 1 }),
      }),
    },
    {
      label: "Last week",
      getValue: () => ({
        from: startOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }),
        to: endOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }),
      }),
    },
    {
      label: "This month",
      getValue: () => ({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      }),
    },
    {
      label: "Last month",
      getValue: () => {
        const lastMonth = subDays(startOfMonth(new Date()), 1);
        return {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        };
      },
    },
  ];

  const handlePresetChange = (preset: PresetOption) => {
    const { from, to } = preset.getValue();
    setStartDate(from);
    setEndDate(to);
    onDateChange(from, to);
    setIsOpen(false);
  };

  const handleDateSelect = (date: Date | undefined, isStart: boolean) => {
    if (isStart) {
      setStartDate(date);
      // If end date is before start date, reset it
      if (endDate && date && endDate < date) {
        setEndDate(undefined);
      }
    } else {
      setEndDate(date);
    }
  };

  const handleApplyFilter = () => {
    onDateChange(startDate, endDate);
    setIsOpen(false);
  };

  const getDateRangeText = () => {
    if (!startDate) return "Select date range";
    if (!endDate) return format(startDate, "PPP");
    if (startDate.toDateString() === endDate.toDateString()) {
      return format(startDate, "PPP");
    }
    return `${format(startDate, "PP")} - ${format(endDate, "PP")}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getDateRangeText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 space-y-3">
            <div className="space-y-3">
              {presets.map((preset) => (
                <div
                  key={preset.label}
                  className="cursor-pointer rounded-lg p-2 hover:bg-muted"
                  onClick={() => handlePresetChange(preset)}
                >
                  {preset.label}
                </div>
              ))}
            </div>
          </div>
          <div className="border-l p-3">
            <div className="space-y-3">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => handleDateSelect(date, true)}
                initialFocus
              />
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => handleDateSelect(date, false)}
                disabled={(date) => startDate ? date < startDate : false}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApplyFilter}
                  disabled={!startDate}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
