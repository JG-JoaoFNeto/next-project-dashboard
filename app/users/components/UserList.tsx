import { getUsers } from "@/lib/actions/user-queries";
import { UserStatus } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import type { UserSearchParams } from "@/types";
import { DeleteButton } from "./DeleteButton";
import { getRoleLabel, getStatusLabel, UserRole } from "@/types/user";
import { Pagination } from "./Pagination";

interface UserListProps {
  searchParams: UserSearchParams;
}

export default async function UserList({ searchParams }: UserListProps) {
  const { users, total, page, totalPages, limit } = await getUsers(searchParams);

  // Status badge styles
  const getStatusBadge = (status: UserStatus) => {
    const styles = {
      [UserStatus.ACTIVE]: "bg-green-100 text-green-800",
      [UserStatus.PENDING]: "bg-yellow-100 text-yellow-800", 
      [UserStatus.INACTIVE]: "bg-red-100 text-red-800",
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {getStatusLabel(status)}
      </span>
    );
  };

  // Role badge styles
  const getRoleBadge = (role: UserRole) => {
    const styles = {
      ADMIN: "bg-purple-100 text-purple-800",
      USER: "bg-blue-100 text-blue-800",
      MODERATOR: "bg-orange-100 text-orange-800",
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[role]}`}>
        {getRoleLabel(role)}
      </span>
    );
  };

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Tente ajustar os filtros ou criar um novo usuário.
        </p>
        <div className="mt-6">
          <Link
            href="/users/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            + Novo Usuário
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <Image
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <Link 
                          href={`/users/${user.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {user.name}
                        </Link>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role as UserRole)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      {/* Ver/Detalhes Button - Elegante e Moderno */}
                      <Link
                        href={`/users/${user.id}`}
                        className="group inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 glow-gray"
                        title="Ver detalhes completos do usuário"
                      >
                        <svg className="w-4 h-4 mr-1.5 opacity-70 group-hover:opacity-100 group-hover:scale-110 icon-enhance" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">Ver</span>
                      </Link>
                      
                      {/* Editar Button - Sofisticado com Cor de Destaque */}
                      <Link
                        href={`/users/${user.id}/edit`}
                        className="group inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-100 hover:text-blue-800 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 glow-blue"
                        title="Editar informações do usuário"
                      >
                        <svg className="w-4 h-4 mr-1.5 opacity-80 group-hover:opacity-100 group-hover:scale-110 icon-enhance" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">Editar</span>
                      </Link>
                      
                      <DeleteButton 
                        userId={user.id} 
                        userName={user.name} 
                        userEmail={user.email}
                        userStatus={user.status}
                        userAvatar={user.avatar}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        itemsPerPage={limit}
      />
    </div>
  );
}