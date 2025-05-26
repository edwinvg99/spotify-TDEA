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

export const DashboardSkeleton = () => (
  <div className="p-4">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-14 h-14 bg-gray-700 rounded-full"></div>
      <div className="space-y-3 w-full">
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
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

export const TracksSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {/* Header de columnas */}
    <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 px-4 py-2 border-b border-gray-800">
      <div className="w-10 h-4 bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-700 rounded w-20"></div>
      <div className="h-4 bg-gray-700 rounded w-24"></div>
      <div className="h-4 bg-gray-700 rounded w-16"></div>
    </div>

    {/* Tracks */}
    {[...Array(10)].map((_, i) => (
      <div
        key={i}
        className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 px-4 py-2"
      >
        {/* Número e imagen */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-4 bg-gray-700 rounded"></div>
          <div className="w-10 h-10 bg-gray-700 rounded"></div>
        </div>

        {/* Título y artista */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>

        {/* Álbum */}
        <div className="flex items-center">
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>

        {/* Duración */}
        <div className="flex items-center">
          <div className="h-4 bg-gray-700 rounded w-12"></div>
        </div>
      </div>
    ))}
  </div>
);
