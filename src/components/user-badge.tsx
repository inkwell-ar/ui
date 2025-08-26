import { User2, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { formatWallet } from '@/lib/utils';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

type UserBadgeProps = {
    key?: string;
    author: string;
    showTooltip?: boolean;
    buttonPosition?: 'left' | 'right';
    onClick?: () => void;
};

const BadgeButton = ({ onClick }: { onClick?: () => void }) => {
    return (
        <Button
            variant="link"
            size="sm"
            className="dark:text-foreground text-background m-0 h-3 w-2 cursor-pointer p-0"
            onClick={onClick}
        >
            <X className="h-1 w-1" />
        </Button>
    );
};

export function UserBadge({
    key,
    author,
    showTooltip,
    buttonPosition,
    onClick,
}: UserBadgeProps) {
    if (!showTooltip) {
        return (
            <Badge
                variant="secondary"
                className="bg-primary hover:bg-primary/80 gap-1"
                {...(key !== undefined ? { key } : {})}
            >
                {buttonPosition === 'left' && <BadgeButton onClick={onClick} />}
                {buttonPosition === 'left' && (
                    <Separator orientation="vertical" />
                )}
                <User2 className="h-3 w-3" />
                {formatWallet(author)}
                {buttonPosition === 'right' && (
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
                <Badge
                    variant="secondary"
                    className="bg-primary text-background dark:text-foreground hover:bg-primary/80 gap-1"
                >
                    {buttonPosition === 'left' && (
                        <BadgeButton onClick={onClick} />
                    )}
                    {buttonPosition === 'left' && (
                        <Separator orientation="vertical" />
                    )}
                    <User2 className="h-3 w-3" />
                    {formatWallet(author)}
                    {buttonPosition === 'right' && (
                        <Separator orientation="vertical" />
                    )}
                    {buttonPosition === 'right' && (
                        <BadgeButton onClick={onClick} />
                    )}
                </Badge>
            </TooltipTrigger>
            <TooltipContent>
                <a href={`https://ao.link/#/entity/${author}`} target="_blank">
                    {author}
                </a>
            </TooltipContent>
        </Tooltip>
    );
}
