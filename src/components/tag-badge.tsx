import { Tag, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { formatWallet } from '@/lib/utils';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

type TagBadgeProps = {
    key?: string;
    label: string;
    showTooltip?: boolean;
    showSeparator?: boolean;
    buttonPosition?: 'left' | 'right';
    onClick?: () => void;
};

const BadgeButton = ({ onClick }: { onClick?: () => void }) => {
    return (
        <Button
            variant="link"
            size="sm"
            className="text-foreground m-0 h-3 w-2 cursor-pointer p-0"
            onClick={onClick}
        >
            <X className="h-1 w-1" />
        </Button>
    );
};

export function TagBadge({
    key,
    label,
    showTooltip,
    showSeparator,
    buttonPosition,
    onClick,
}: TagBadgeProps) {
    if (!showTooltip || label.length <= 13) {
        return (
            <Badge
                variant="secondary"
                className="gap-1"
                {...(key !== undefined ? { key } : {})}
            >
                {buttonPosition === 'left' && <BadgeButton onClick={onClick} />}
                {buttonPosition === 'left' && showSeparator && (
                    <Separator orientation="vertical" />
                )}
                <Tag className="h-3 w-3" />
                {label.length > 13 ? formatWallet(label) : label}
                {buttonPosition === 'right' && showSeparator && (
                    <Separator orientation="vertical" />
                )}
                {buttonPosition === 'right' && (
                    <BadgeButton onClick={onClick} />
                )}
            </Badge>
        );
    }

    return (
        <Tooltip {...(key !== undefined ? { key } : {})}>
            <TooltipTrigger asChild>
                <Badge variant="secondary" className="gap-1">
                    {buttonPosition === 'left' && (
                        <BadgeButton onClick={onClick} />
                    )}
                    {buttonPosition === 'left' && showSeparator && (
                        <Separator orientation="vertical" />
                    )}
                    <Tag className="h-3 w-3" />
                    {label.length > 13 ? formatWallet(label) : label}
                    {buttonPosition === 'right' && showSeparator && (
                        <Separator orientation="vertical" />
                    )}
                    {buttonPosition === 'right' && (
                        <BadgeButton onClick={onClick} />
                    )}
                </Badge>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}
