import { useBlogsContext } from '@/contexts/blogs-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Edit, Trash2, UserPlus2, Check, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function UsersManagement() {
    const { blogWallets, isLoadingBlogWallets, selectedBlog, removeUser } =
        useBlogsContext();
    const [showRemoveUserDialog, setShowRemoveUserDialog] = useState(false);
    const [userToRemove, setUserToRemove] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    const formatWallet = (wallet: string) => {
        return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
    };

    const hasRole = (blogWallet: any, role: string) => {
        return blogWallet.roles.includes(role);
    };

    const isLastAdmin = (wallet: string) => {
        const admins = blogWallets.filter((bw) =>
            bw.roles.includes('DEFAULT_ADMIN_ROLE')
        );
        return admins.length === 1 && admins[0].wallet === wallet;
    };

    const handleRemoveUser = (wallet: string) => {
        if (isLastAdmin(wallet)) {
            toast.error('Cannot remove the last admin from the blog');
            return;
        }
        setUserToRemove(wallet);
        setShowRemoveUserDialog(true);
    };

    const confirmRemoveUser = async () => {
        if (!userToRemove || !selectedBlog) return;

        setIsRemoving(true);
        try {
            const result = await removeUser(selectedBlog, userToRemove);
            if (result.success) {
                console.log('User removed successfully');
                setShowRemoveUserDialog(false);
            } else {
                console.error('Failed to remove user:', result.error);
                // TODO: Show error toast
            }
        } catch (error) {
            console.error('Error removing user:', error);
            // TODO: Show error toast
        } finally {
            setIsRemoving(false);
        }
    };

    useEffect(() => {
        if (!showRemoveUserDialog) {
            setUserToRemove(null);
        }
    }, [showRemoveUserDialog]);

    if (isLoadingBlogWallets) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Users Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage users and their roles for this blog
                    </p>
                </div>
                <Link to={`/admin/new-user`}>
                    <Button>
                        <UserPlus2 className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Blog Users ({blogWallets.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {blogWallets.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-muted-foreground">
                                No users found for this blog.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Wallet</TableHead>
                                    <TableHead className="text-center">
                                        Admin
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Editor
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {blogWallets.map((blogWallet) => (
                                    <TableRow key={blogWallet.wallet}>
                                        <TableCell className="font-mono">
                                            {formatWallet(blogWallet.wallet)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {hasRole(
                                                blogWallet,
                                                'DEFAULT_ADMIN_ROLE'
                                            ) ? (
                                                <Check className="mx-auto h-4 w-4 text-green-600" />
                                            ) : (
                                                <Minus className="text-muted-foreground mx-auto h-4 w-4" />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {hasRole(
                                                blogWallet,
                                                'EDITOR_ROLE'
                                            ) ? (
                                                <Check className="mx-auto h-4 w-4 text-green-600" />
                                            ) : (
                                                <Minus className="text-muted-foreground mx-auto h-4 w-4" />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        // TODO: Implement edit user functionality
                                                        console.log(
                                                            'Edit user:',
                                                            blogWallet.wallet
                                                        );
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleRemoveUser(
                                                            blogWallet.wallet
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <ConfirmDialog
                open={showRemoveUserDialog}
                onOpenChange={setShowRemoveUserDialog}
                onConfirm={confirmRemoveUser}
                title="Remove User"
                description={`Are you sure you want to remove user ${userToRemove ? formatWallet(userToRemove) : ''} from this blog? This action cannot be undone.`}
                confirmText={isRemoving ? 'Removing...' : 'Remove'}
                cancelText="Cancel"
            />
        </div>
    );
}
