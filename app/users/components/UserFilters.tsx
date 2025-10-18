import { UserStatus } from "@prisma/client";
import Link from "next/link";
import { FilterSelect, SearchInput, SortToggle } from "./FilterComponents";
import { ROLE_LABELS, STATUS_LABELS } from "@/types/user";

interface UserFiltersProps {
  searchParams: {
    search?: string;
    status?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function UserFilters({ searchParams }: UserFiltersProps) {
  const currentSearch = searchParams.search || "";
  const currentStatus = searchParams.status || "all";
  const currentRole = searchParams.role || "all";
  const currentSortBy = searchParams.sortBy || "createdAt";
  const currentSortOrder = searchParams.sortOrder || "desc";

  // Status options with Portuguese labels
  const statusOptions = [
    { label: "Todos os Status", value: "all" },
    { label: STATUS_LABELS.ACTIVE, value: UserStatus.ACTIVE },
    { label: STATUS_LABELS.PENDING, value: UserStatus.PENDING },
    { label: STATUS_LABELS.INACTIVE, value: UserStatus.INACTIVE },
  ];

  // Role options with Portuguese labels
  const roleOptions = [
    { label: "Todas as Funções", value: "all" },
    ...Object.entries(ROLE_LABELS).map(([key, label]) => ({
      label,
      value: key,
    })),
  ];

  // Sort options
  const sortOptions = [
    { label: "Data de Criação", value: "createdAt" },
    { label: "Nome", value: "name" },
    { label: "Email", value: "email" },
    { label: "Última Atualização", value: "updatedAt" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <SearchInput defaultValue={currentSearch} />

          {/* Status Filter */}
          <div className="min-w-[140px]">
            <FilterSelect
              name="status"
              value={currentStatus}
              options={statusOptions}
              placeholder="Todos os Status"
            />
          </div>

          {/* Role Filter */}
          <div className="min-w-[140px]">
            <FilterSelect
              name="role"
              value={currentRole}
              options={roleOptions}
              placeholder="Todas as Funções"
            />
          </div>
        </div>

        {/* Sort and Actions */}
        <div className="flex gap-4 items-center">
          {/* Sort */}
          <div className="flex gap-2">
            <FilterSelect
              name="sortBy"
              value={currentSortBy}
              options={sortOptions}
              placeholder="Ordenar por"
            />
            
            <SortToggle currentOrder={currentSortOrder} />
          </div>

          {/* Add User Button */}
          <Link
            href="/users/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            + Novo Usuário
          </Link>
        </div>
      </div>

      {/* Clear Filters - Always visible */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        {(currentSearch || currentStatus !== "all" || currentRole !== "all") ? (
          <Link
            href="/users"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpar filtros
          </Link>
        ) : (
          <span className="text-sm text-gray-400 flex items-center gap-1 cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpar filtros
          </span>
        )}
      </div>
    </div>
  );
}