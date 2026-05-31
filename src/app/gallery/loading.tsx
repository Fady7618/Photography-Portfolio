export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="h-10 bg-orange-200 rounded w-64 mx-auto mb-4" />
        <div className="h-5 bg-orange-200 rounded w-96 mx-auto mb-8" />
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-orange-200 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/3] bg-orange-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
