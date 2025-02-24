
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
  onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

type PresetOption = {
  label: string;
  getValue: () => { from: Date; to: Date };
};

export const DateRangeFilter = ({ onDateChange }: DateRangeFilterProps) => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  // Get the maximum allowed start date (37 months ago)
  const maxStartDate = subMonths(new Date(), 37);

  const presets: PresetOption[] = [
    {
      label: "Maximum (37 months)",
      getValue: () => ({
        from: maxStartDate,
        to: new Date(),
      }),
    },
    {
      label: "Today",
      getValue: () => ({
        from: new Date(),
        to: new Date(),
      }),
    },
    {
      label: "Yesterday",
      getValue: () => ({
        from: subDays(new Date(), 1),
        to: subDays(new Date(), 1),
      }),
    },
    {
      label: "This week",
      getValue: () => ({
        from: startOfWeek(new Date()),
        to: endOfWeek(new Date()),
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
      getValue: () => ({
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfMonth(subMonths(new Date(), 1)),
      }),
    },
  ];

  const selectPreset = (preset: PresetOption) => {
    const newRange = preset.getValue();
    setDate(newRange);
    onDateChange(newRange.from, newRange.to);
    setIsOpen(false);
  };

  const selectRange = (range: DateRange | undefined) => {
    setDate(range);
    // Only trigger the onDateChange if both from and to are selected
    if (range?.from && range?.to) {
      onDateChange(range.from, range.to);
      setIsOpen(false);
    }
  };

  const getPresetLabel = (range: DateRange | undefined): string => {
    if (!range?.from || !range?.to) return "Select dates";

    // Check if the range matches any preset
    for (const preset of presets) {
      const presetRange = preset.getValue();
      if (
        format(presetRange.from, "yyyy-MM-dd") === format(range.from, "yyyy-MM-dd") &&
        format(presetRange.to, "yyyy-MM-dd") === format(range.to, "yyyy-MM-dd")
      ) {
        return preset.label;
      }
    }

    // If no preset matches, return the date range
    if (format(range.from, "yyyy-MM-dd") === format(range.to, "yyyy-MM-dd")) {
      return format(range.from, "MMM d, yyyy");
    }
    return `${format(range.from, "MMM d, yyyy")} - ${format(range.to, "MMM d, yyyy")}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[240px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getPresetLabel(date)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="space-y-4 p-3">
          <div className="grid gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                onClick={() => selectPreset(preset)}
                className="justify-start font-normal"
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="border-t border-border pt-4">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={selectRange}
              numberOfMonths={2}
              disabled={(date) => date > new Date() || date < maxStartDate}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

