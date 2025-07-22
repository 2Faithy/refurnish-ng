'use client';

import Link from 'next/link';

export default function DashboardCard({
  title,
  link,
  icon,
}: {
  title: string;
  link: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={link} className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="flex items-center space-x-4">
        <div className="text-3xl text-[#775522]">{icon}</div>
        <div className="text-lg font-semibold text-gray-800">{title}</div>
      </div>
    </Link>
  );
}
