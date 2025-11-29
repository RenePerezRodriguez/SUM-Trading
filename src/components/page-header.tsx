
type PageHeaderProps = {
    title: string;
    description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter font-headline">
                {title}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                {description}
            </p>
        </div>
    );
}
