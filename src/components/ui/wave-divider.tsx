export default function WaveDivider({ 
    flip = false, 
    color = 'bg-background',
    className = '' 
}: { 
    flip?: boolean; 
    color?: string;
    className?: string;
}) {
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
                    className={`${color === 'bg-background' ? 'fill-background' : color === 'bg-muted/30' ? 'fill-muted/30' : 'fill-muted/50'}`}
                />
            </svg>
        </div>
    );
}
