import { Calendar, FilePenLine, type LucideIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DateDisplayProps {
    timestamp: number;
    size?: 'sm' | 'default';
    showIcon?: boolean;
    className?: string;
    showTime?: boolean;
    isLastUpdate?: boolean;
}

export function DateDisplay({
    timestamp,
    size = 'default',
    showIcon = true,
    isLastUpdate = false,
    className = '',
    showTime = false,
}: DateDisplayProps) {
    const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
    const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
    const dateFormat = showTime ? "MMM d, yyyy 'at' h:mm a" : 'MMM d, yyyy';

    return (
        <div
            className={`text-muted-foreground flex flex-nowrap items-center gap-1 ${textSize} ${className}`}
        >
            {showIcon && isLastUpdate ? (
                <FilePenLine className={iconSize} />
            ) : (
                <Calendar className={iconSize} />
            )}
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {format(new Date(timestamp), dateFormat)}
            </span>
        </div>
    );
}
