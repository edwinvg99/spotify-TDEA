const LoadingState = () => (
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

export default LoadingState;