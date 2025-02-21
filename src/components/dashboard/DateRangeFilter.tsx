
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateRangeFilterProps {
  onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

export const DateRangeFilter = ({ onDateChange }: DateRangeFilterProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

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
  };

  return (
    <div className="flex gap-4 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "PPP") : "Start date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(date) => handleDateSelect(date, true)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "PPP") : "End date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(date) => handleDateSelect(date, false)}
            initialFocus
            disabled={(date) => startDate ? date < startDate : false}
          />
        </PopoverContent>
      </Popover>

      <Button 
        onClick={handleApplyFilter}
        className="ml-2"
      >
        Apply Filter
      </Button>
    </div>
  );
};

