export default function WaveDivider({ 
    flip = false, 
    color = 'bg-background',
    className = '' 
}: { 
    flip?: boolean; 
    color?: string;
    className?: string;
}) {
    let fillClass = 'fill-muted/50';
    if (color === 'bg-background') fillClass = 'fill-background';
    else if (color === 'bg-muted/30') fillClass = 'fill-muted/30';
    else if (color === 'bg-primary') fillClass = 'fill-primary';

    return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ height: '80px' }}>
            <svg
                className={`absolute w-full h-full ${flip ? 'rotate-180' : ''}`}
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
                    className={fillClass}
                />
            </svg>
        </div>
    );
}
