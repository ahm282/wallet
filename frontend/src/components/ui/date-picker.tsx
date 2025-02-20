"use client";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
    className?: string;
    date: Date | undefined;
    onSelect: (date: Date | undefined) => void;
}

export function DatePicker({ className, date, onSelect }: DatePickerProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (date: Date | undefined) => {
        onSelect(date);
        setOpen(false); // close the popover after selection
    };

    return (
        <div className={className}>
            <Popover
                open={open}
                onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant='outline'
                        className={cn("!w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                        <CalendarIcon className='me-2 size-4' />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className='w-full p-0'
                    align='center'>
                    <Calendar
                        mode='single'
                        selected={date}
                        onSelect={handleSelect}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default DatePicker;
