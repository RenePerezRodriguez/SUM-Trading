'use client';

interface BatchInfoDisplayProps {
  currentPage: number;
}

export function BatchInfoDisplay({ currentPage }: BatchInfoDisplayProps) {
  const batchNumber = Math.floor((currentPage - 1) / 10);
  const pageWithinBatch = ((currentPage - 1) % 10) + 1;
  const isLastPageOfBatch = currentPage % 10 === 0;

  return (
    <div className="flex items-center gap-2 text-sm bg-secondary/50 px-4 py-2 rounded-lg">
      <span className="font-semibold text-primary">📦 Batch {batchNumber}</span>
      <span className="text-muted-foreground">|</span>
      <span className="text-muted-foreground">
        Página {pageWithinBatch} de 10 en este batch
      </span>
      {isLastPageOfBatch && (
        <>
          <span className="text-muted-foreground">|</span>
          <span className="text-yellow-600 font-medium">
            ⚡ Siguiente página: nuevo batch (~3-5 min primera vez)
          </span>
        </>
      )}
    </div>
  );
}
