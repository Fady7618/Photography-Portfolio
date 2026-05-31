export default function Loading() {
  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-800 mx-auto mb-4" />
        <p className="text-orange-700">Loading...</p>
      </div>
    </div>
  )
}
