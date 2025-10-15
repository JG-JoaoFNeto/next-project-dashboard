import { Suspense } from "react";
import UserStats from "./components/UserStats";
import UserFilters from "./components/UserFilters";
import UserList from "./components/UserList";
import type { ServerComponentProps } from "@/types";

// Loading components
function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
          <div className="flex items-center">
            <div className="p-2 bg-gray-200 rounded-lg w-10 h-10"></div>
            <div className="ml-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FiltersLoading() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex gap-4 flex-1">
          <div className="h-10 bg-gray-200 rounded-lg flex-1 max-w-md"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-10"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
        </div>
      </div>
    </div>
  );
}

function ListLoading() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 bg-gray-300 rounded w-12"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </th>
              <th className="px-6 py-3 text-right">
                <div className="h-4 bg-gray-300 rounded w-12 ml-auto"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="ml-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function UsersPage({ searchParams }: ServerComponentProps) {
  const awaitedParams = await searchParams;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Usuários</h1>
          <p className="mt-2 text-gray-600">
            Gerencie usuários com filtros dinâmicos e busca em tempo real
          </p>
        </div>

        {/* Statistics */}
        <Suspense fallback={<StatsLoading />}>
          <UserStats />
        </Suspense>

        {/* Filters */}
        <Suspense fallback={<FiltersLoading />}>
          <UserFilters searchParams={awaitedParams} />
        </Suspense>

        {/* User List */}
        <Suspense fallback={<ListLoading />}>
          <UserList searchParams={awaitedParams} />
        </Suspense>
      </div>
    </div>
  );
}