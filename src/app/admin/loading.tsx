export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="h-8 bg-orange-200 rounded w-64 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-orange-200 rounded" />
          ))}
        </div>
        <div className="h-96 bg-orange-200 rounded" />
      </div>
    </div>
  )
}
