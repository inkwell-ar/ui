import { Tag } from 'lucide-react';
import { Badge } from './ui/badge';

type TagBadgeProps = {
    key?: string;
    label: string;
};

export function TagBadge({ key, label }: TagBadgeProps) {
    return (
        <Badge
            variant="outline"
            className="hover:bg-accent hover:text-accent-foreground gap-1 hover:cursor-default"
            {...(key !== undefined ? { key } : {})}
        >
            <Tag className="h-3 w-3" />
            {label}
        </Badge>
    );
}
