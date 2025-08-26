import { User2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { formatWallet } from '@/lib/utils';

type UserBadgeProps = {
    key?: string;
    author: string;
    showTooltip?: boolean;
};

export function UserBadge({ key, author, showTooltip }: UserBadgeProps) {
    if (!showTooltip) {
        return (
            <Badge
                variant="secondary"
                className="bg-primary hover:bg-primary/80 gap-1"
                {...(key !== undefined ? { key } : {})}
            >
                <User2 className="h-3 w-3" />
                {formatWallet(author)}
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
                    <User2 className="h-3 w-3" />
                    {formatWallet(author)}
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
