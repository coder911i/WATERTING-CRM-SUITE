export default function DashboardLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        <p className="text-sm text-gray-500 font-medium">Loading Workspace...</p>
      </div>
    </div>
  );
}
