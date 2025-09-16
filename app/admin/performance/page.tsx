import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Performances globales",
  description: "Performances globales du système",
}

export default function AdminPerformancePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Performances globales</h2>
      </div>
      <div className="flex-1 rounded-lg border border-dashed border-gray-200 p-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Cette fonctionnalité est en cours de développement</h3>
            <p className="text-gray-500">Les indicateurs de performances globales seront bientôt disponibles.</p>
          </div>
        </div>
      </div>
    </div>
  )
}