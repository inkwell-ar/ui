import { ChevronDownIcon, CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
    value?: number | null; // timestamp
    onChange?: (timestamp: number | null) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function DateTimePicker({
    value,
    onChange,
    label = 'Date & Time',
    placeholder = 'Select date and time',
    className,
    disabled = false,
}: DateTimePickerProps) {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        value ? new Date(value) : undefined
    );
    const [timeValue, setTimeValue] = useState<string>('');

    // Initialize time value from timestamp
    useEffect(() => {
        if (value) {
            const date = new Date(value);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            setTimeValue(`${hours}:${minutes}:${seconds}`);
            setSelectedDate(date);
        } else {
            setTimeValue('');
            setSelectedDate(undefined);
        }
    }, [value]);

    // Combine date and time into timestamp
    const updateTimestamp = (newDate?: Date, newTime?: string) => {
        const dateToUse = newDate ?? selectedDate;
        const timeToUse = newTime ?? timeValue;

        if (!dateToUse || !timeToUse) {
            onChange?.(null);
            return;
        }

        // Parse time string (HH:MM or HH:MM:SS)
        const timeParts = timeToUse.split(':').map(Number);
        const [hours, minutes, seconds = 0] = timeParts;

        // Validate time values
        if (
            isNaN(hours) ||
            isNaN(minutes) ||
            (timeParts.length > 2 && isNaN(seconds)) ||
            hours < 0 ||
            hours > 23 ||
            minutes < 0 ||
            minutes > 59 ||
            seconds < 0 ||
            seconds > 59
        ) {
            console.error('Invalid time format:', timeToUse);
            return;
        }

        // Create new date with selected date and time
        const combinedDateTime = new Date(dateToUse);
        combinedDateTime.setHours(hours, minutes, seconds, 0);

        const timestamp = combinedDateTime.getTime();

        // Validate the resulting timestamp
        if (isNaN(timestamp)) {
            console.error('Invalid date/time combination');
            return;
        }

        onChange?.(timestamp);
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        setOpen(false);

        if (date) {
            // If no time is set, default to current time
            if (!timeValue) {
                const now = new Date();
                const defaultTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
                setTimeValue(defaultTime);
                updateTimestamp(date, defaultTime);
            } else {
                updateTimestamp(date, timeValue);
            }
        } else {
            updateTimestamp(undefined, timeValue);
        }
    };

    const handleTimeChange = (newTime: string) => {
        setTimeValue(newTime);
        updateTimestamp(selectedDate, newTime);
    };

    const clearDateTime = () => {
        setSelectedDate(undefined);
        setTimeValue('');
        onChange?.(null);
    };

    const formatDisplayDate = () => {
        if (!selectedDate) return placeholder;

        const dateStr = selectedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

        if (timeValue) {
            return `${dateStr}`;
            // return `${dateStr} at ${timeValue}`;
        }

        return dateStr;
    };

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            {label && (
                <Label className="flex items-center gap-2 text-base font-semibold">
                    <CalendarIcon className="h-4 w-4" />
                    {label}
                </Label>
            )}

            <div className="flex gap-2">
                {/* Date Picker */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            disabled={disabled}
                            className="max-w-fit flex-1 justify-between font-normal"
                        >
                            <span className="truncate">
                                {formatDisplayDate()}
                            </span>
                            <ChevronDownIcon className="h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                    >
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            captionLayout="dropdown"
                            disabled={disabled}
                        />
                    </PopoverContent>
                </Popover>

                {/* Time Input */}
                <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    value={timeValue}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    disabled={disabled || !selectedDate}
                    // className="w-32"
                    defaultValue="10:30:00"
                    className="bg-background max-w-fit appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />

                {/* Clear Button */}
                {(selectedDate || timeValue) && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={clearDateTime}
                        disabled={disabled}
                        className="shrink-0"
                    >
                        ×
                    </Button>
                )}
            </div>

            {/* Debug info (remove in production) */}
            {value && (
                <div className="text-muted-foreground text-xs">
                    Timestamp: {value} →{' '}
                    {new Date(value)
                        .toISOString()
                        .replace('T', ' ')
                        .replace('.000Z', ' GMT')}
                </div>
            )}
        </div>
    );
}

// Legacy component for backward compatibility
export function Calendar24() {
    const [timestamp, setTimestamp] = useState<number | null>(null);

    return (
        <DateTimePicker
            value={timestamp}
            onChange={setTimestamp}
            label="Date & Time"
        />
    );
}
