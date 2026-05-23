import { SessionManager } from '@/components/admin'

export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-orange-800 mb-6 plasterFont">Upload Manager</h1>
      <SessionManager />
    </div>
  )
}
