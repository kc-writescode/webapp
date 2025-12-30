/**
 * NewsSkeleton Component
 * Loading skeleton for news articles
 */

const NewsSkeleton = ({ count = 6 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="aspect-video w-full bg-slate-700" />

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 bg-slate-700 rounded w-full" />
              <div className="h-5 bg-slate-700 rounded w-3/4" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-slate-700 rounded w-full" />
              <div className="h-4 bg-slate-700 rounded w-5/6" />
              <div className="h-4 bg-slate-700 rounded w-4/6" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-3 bg-slate-700 rounded w-20" />
              <div className="h-3 bg-slate-700 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default NewsSkeleton;
