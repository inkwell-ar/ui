import { useBlogsContext, type BlogData } from '@/contexts/blogs-context';
import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { isArweaveTxId, isValidUrl, getImageSource } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';
import { routesConfig } from '@/lib/routes-config';

export default function BlogInfo() {
    const { blogId } = useParams();
    const { blogsData, isLoadingBlogDetails, isAdmin } = useBlogsContext();

    const blogData = useMemo(
        () => blogsData.find((blog: BlogData) => blog.id === blogId),
        [blogsData, blogId]
    );

    if (isLoadingBlogDetails) {
        return (
            <div className="flex h-full items-center justify-center">
                <span className="text-muted-foreground">
                    Loading blog information...
                </span>
                <LoaderCircle className="size-4 animate-spin" />
            </div>
        );
    }

    if (!blogData) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Blog not found</p>
            </div>
        );
    }

    const logoSrc = getImageSource(blogData.logo);

    return (
        <div className="container mx-auto max-w-4xl p-6">
            <Card>
                <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-6">
                            {logoSrc && (
                                <img
                                    src={logoSrc}
                                    alt={`${blogData.title} logo`}
                                    className="size-12 rounded-lg object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            )}
                            <div className="flex-1 space-y-2">
                                <CardTitle className="text-3xl font-bold">
                                    {blogData.title}
                                </CardTitle>
                                <Button
                                    variant="link"
                                    className="text-muted-foreground truncate font-mono text-sm break-all text-ellipsis"
                                >
                                    {blogData.id}
                                </Button>
                            </div>
                        </div>
                        {isAdmin && (
                            <Button variant="outline" size="sm" asChild>
                                <Link to={`/blog/${blogData.id}/edit`}>
                                    <routesConfig.blogEditor.icon className="size-4" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="mb-2 text-lg font-semibold">
                                Description
                            </h3>
                            <p className="text-foreground leading-relaxed">
                                {blogData.description ||
                                    'No description available'}
                            </p>
                        </div>

                        {blogData.logo && (
                            <div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    Logo Information
                                </h3>
                                <div className="text-muted-foreground space-y-1 text-sm">
                                    <p>
                                        <span className="font-medium">
                                            Type:
                                        </span>{' '}
                                        {isArweaveTxId(blogData.logo) ? (
                                            <a
                                                href={`https://viewblock.io/arweave/tx/${blogData.logo}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Arweave Transaction
                                            </a>
                                        ) : isValidUrl(blogData.logo) ? (
                                            <a
                                                href={blogData.logo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                'External URL'
                                            </a>
                                        ) : (
                                            'Invalid'
                                        )}
                                    </p>
                                    <p className="break-all text-ellipsis">
                                        <span className="font-medium">
                                            Source:
                                        </span>{' '}
                                        {isValidUrl(blogData.logo) ||
                                        isArweaveTxId(blogData.logo) ? (
                                            <a
                                                className="font-mono"
                                                href={
                                                    isValidUrl(blogData.logo)
                                                        ? blogData.logo
                                                        : `https://arweave.net/${blogData.logo}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {isValidUrl(blogData.logo)
                                                    ? 'Open URL'
                                                    : blogData.logo}
                                            </a>
                                        ) : (
                                            blogData.logo
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
