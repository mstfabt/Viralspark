export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold tracking-tighter text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Sayfa bulunamadi</h2>
        <p className="text-gray-500 mb-8">Aradiginiz sayfa mevcut degil veya tasindi.</p>
        <div className="flex gap-3 justify-center">
          <a href="/" className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors text-sm">
            Ana Sayfa
          </a>
          <a href="/dashboard" className="bg-gray-100 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors text-sm">
            Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
