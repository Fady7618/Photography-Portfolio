import { SessionManager } from '@/components/admin'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-800 mb-6 plasterFont">Upload Manager</h1>
        <SessionManager />
      </div>
    </div>
  )
}
