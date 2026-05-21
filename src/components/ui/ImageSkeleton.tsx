interface ImageSkeletonProps {
  className?: string
}

export default function ImageSkeleton({ className = '' }: ImageSkeletonProps) {
  return (
    <div className={`animate-pulse bg-orange-200 rounded-lg overflow-hidden ${className}`}>
      <div className="aspect-square bg-orange-300"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-orange-200 rounded w-3/4"></div>
        <div className="h-3 bg-orange-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}