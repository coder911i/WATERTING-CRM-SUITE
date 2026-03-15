'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export default function ProjectsPage() {
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get('/projects');
      return res.data;
    },
    placeholderData: [
      { id: '1', name: 'Aqua Vista', location: 'Navi Mumbai', projectType: 'RESIDENTIAL', status: 'ACTIVE', amenities: ['Pool', 'Gym'] },
      { id: '2', name: 'Skyline', location: 'Worli', projectType: 'RESIDENTIAL', status: 'ACTIVE', amenities: ['Clubhouse'] },
    ],
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects Workspace</h1>
          <p className="text-sm text-gray-500">Manage real estate developments and building towers grids.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project: any) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.location}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {project.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {project.amenities?.map((amenity: string) => (
                    <span key={amenity} className="text-xxs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="border-t pt-4 flex justify-between items-center text-sm text-center">
                  <span className="text-gray-500 capitalize">{project.projectType?.toLowerCase()}</span>
                  <button className="text-teal-600 font-medium hover:underline">View Towers</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
