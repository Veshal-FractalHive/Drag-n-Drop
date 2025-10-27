import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  headerActions?: ReactNode;
}

export function PageLayout({ title, subtitle, children, headerActions }: PageLayoutProps) {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Navigation Header */}
      <div className="mb-4 flex justify-between items-center">
        <Link to="/" className="text-blue-500 hover:underline font-medium">
          ← Back to Home
        </Link>
        {headerActions}
      </div>

      {/* Title and Subtitle */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-center">{title}</h1>
        {subtitle && <p className="text-gray-600 text-center">{subtitle}</p>}
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
