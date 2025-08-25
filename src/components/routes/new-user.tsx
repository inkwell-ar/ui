import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Pencil, Save, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import { isArweaveTxId } from '@/lib/utils';
import { useBlogsContext } from '@/contexts/blogs-context';

export default function NewUser() {
    const navigate = useNavigate();
    const { selectedBlog, addUser } = useBlogsContext();
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        wallet: '',
        isAdmin: false,
        isEditor: false,
    });

    const hasChanges = useMemo(() => {
        return formData.wallet !== '' || formData.isAdmin || formData.isEditor;
    }, [formData]);

    const isValid = useMemo(() => {
        return (
            isArweaveTxId(formData.wallet) &&
            (formData.isAdmin || formData.isEditor)
        );
    }, [formData]);

    const handleInputChange = (
        field: keyof typeof formData,
        value: string | boolean
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        if (!isValid || !selectedBlog) return;

        setIsSaving(true);
        try {
            const result = await addUser(
                formData.wallet,
                formData.isAdmin,
                formData.isEditor
            );

            if (result.success) {
                toast.success('User added successfully');
                navigate('/admin/users');
            } else {
                toast.error(result.error || 'Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error('Failed to add user');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            setShowCancelDialog(true);
        } else {
            navigate('/admin/users');
        }
    };

    const confirmCancel = () => {
        navigate('/admin/users');
    };

    return (
        <div className="container mx-auto max-w-2xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Add New User</h1>
                    <p className="text-muted-foreground mt-2">
                        Add a new user to this blog with specific roles
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="wallet">Arweave Wallet Address</Label>
                        <Input
                            id="wallet"
                            value={formData.wallet}
                            onChange={(e) =>
                                handleInputChange('wallet', e.target.value)
                            }
                            placeholder="43-character Arweave wallet address"
                            className={
                                formData.wallet &&
                                !isArweaveTxId(formData.wallet)
                                    ? 'border-destructive'
                                    : ''
                            }
                        />
                        {formData.wallet && !isArweaveTxId(formData.wallet) && (
                            <p className="text-destructive text-sm">
                                Please enter a valid Arweave wallet address
                            </p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Label>Roles</Label>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="admin"
                                    checked={formData.isAdmin}
                                    onCheckedChange={(checked) =>
                                        handleInputChange('isAdmin', !!checked)
                                    }
                                />
                                <Label
                                    htmlFor="admin"
                                    className="font-mono font-normal"
                                >
                                    <ShieldCheck className="h-4 w-4 text-green-500" />{' '}
                                    <span className="font-bold">Admin</span>{' '}
                                    &nbsp;&nbsp; Full permissions to manage the
                                    blog
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="editor"
                                    checked={formData.isEditor}
                                    onCheckedChange={(checked) =>
                                        handleInputChange('isEditor', !!checked)
                                    }
                                />
                                <Label
                                    htmlFor="editor"
                                    className="font-mono font-normal"
                                >
                                    <Pencil className="h-4 w-4" />
                                    <span className="font-bold">
                                        Editor
                                    </span>{' '}
                                    &nbsp; Can create and edit posts
                                </Label>
                            </div>
                        </div>
                        {!formData.isAdmin && !formData.isEditor && (
                            <p className="text-muted-foreground text-sm">
                                Please select at least one role
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSaving}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!isValid || isSaving}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? 'Adding...' : 'Add User'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <ConfirmDialog
                open={showCancelDialog}
                onOpenChange={setShowCancelDialog}
                onConfirm={confirmCancel}
                title="Discard Changes"
                description="Are you sure you want to discard your changes? This action cannot be undone."
                confirmText="Discard"
                cancelText="Continue Editing"
            />
        </div>
    );
}
