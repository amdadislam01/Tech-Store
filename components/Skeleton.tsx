const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
};

export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-full" />
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
};

export default Skeleton;
