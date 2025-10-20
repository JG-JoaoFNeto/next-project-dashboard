import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUserById } from "@/lib/actions/user-queries";
import { getRoleLabel, getStatusLabel } from "@/types/user";
import { DeleteButton } from "../components/DeleteButton";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/users"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Usuários
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {user.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <Image
                    className="h-16 w-16 rounded-full border-2 border-gray-200"
                    src={user.avatar}
                    alt={user.name}
                    width={64}
                    height={64}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-200">
                    <svg className="h-8 w-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-lg text-gray-600">{user.email}</p>
                <div className="mt-2 flex items-center space-x-4">
                  {/* Status Badge */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : user.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {getStatusLabel(user.status)}
                  </span>

                  {/* Role Badge */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "MODERATOR"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {getRoleLabel(user.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3" style={{ position: 'relative', right: 0, transform: 'none' }}>
              <Link
                href={`/users/${user.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </Link>

              <DeleteButton 
                userId={user.id} 
                userName={user.name} 
                userEmail={user.email}
                userStatus={user.status}
                userAvatar={user.avatar}
              />
            </div>
          </div>
        </div>

        {/* User Details Card */}
        <div className="bg-white shadow-sm rounded-lg border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Informações do Usuário</h2>
          </div>
          
          <div className="px-6 py-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {/* ID */}
              <div>
                <dt className="text-sm font-medium text-gray-500">ID</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {user.id}
                </dd>
              </div>

              {/* Email */}
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>

              {/* Status */}
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : user.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {getStatusLabel(user.status)}
                  </span>
                </dd>
              </div>

              {/* Role */}
              <div>
                <dt className="text-sm font-medium text-gray-500">Função</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "MODERATOR"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {getRoleLabel(user.role)}
                  </span>
                </dd>
              </div>

              {/* Created At */}
              <div>
                <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </dd>
              </div>

              {/* Updated At */}
              <div>
                <dt className="text-sm font-medium text-gray-500">Última atualização</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.updatedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </dd>
              </div>

              {/* Avatar URL */}
              {user.avatar && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Avatar URL</dt>
                  <dd className="mt-1 text-sm text-gray-900 break-all">
                    <a 
                      href={user.avatar} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500 underline"
                    >
                      {user.avatar}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}