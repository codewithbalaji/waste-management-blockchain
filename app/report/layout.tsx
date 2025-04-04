import Link from 'next/link';

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/landing" className="flex items-center space-x-2">
              <svg className="h-7 w-7 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 3v1H4v2h1v13a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9zm0 5h2v9H9V8zm4 0h2v9h-2V8z"/>
              </svg>
              <span className="font-medium text-gray-900">Waste Management Blockchain</span>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/landing" className="text-gray-500 hover:text-gray-900">Home</Link>
              <Link href="/report" className="text-green-600 font-medium">Report Dumping</Link>
            </nav>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
} 