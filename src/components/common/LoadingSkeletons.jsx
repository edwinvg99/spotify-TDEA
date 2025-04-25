export const ProfileSkeleton = () => (
  <div className="animate-pulse flex items-center gap-4">
    <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-700 rounded w-48"></div>
      <div className="h-3 bg-gray-700 rounded w-32"></div>
      <div className="h-3 bg-gray-700 rounded w-24"></div>
    </div>
  </div>
);

export const PlaylistSkeleton = () => (
  <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="aspect-square bg-gray-700"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

export const PlayerSkeleton = () => (
  <div className="animate-pulse fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
    <div className="max-w-screen-xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 bg-gray-700 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-32"></div>
          <div className="h-3 bg-gray-700 rounded w-24"></div>
        </div>
      </div>
      <div className="flex-1 mx-6">
        <div className="h-1 bg-gray-700 rounded-full"></div>
      </div>
      <div className="w-24 h-8 bg-gray-700 rounded"></div>
    </div>
  </div>
);