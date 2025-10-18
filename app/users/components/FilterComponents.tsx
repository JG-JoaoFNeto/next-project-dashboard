"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface FilterSelectProps {
  name: string;
  value: string;
  options: { label: string; value: string }[];
  placeholder: string;
}

export function FilterSelect({ name, value, options }: FilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (newValue && newValue !== "all" && newValue !== "") {
      params.set(name, newValue);
    } else {
      params.delete(name);
    }

    // Reset to first page when filtering
    params.delete("page");

    const paramString = params.toString();
    router.push(`/users${paramString ? `?${paramString}` : ""}`);
  };

  return (
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-400"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface SearchInputProps {
  defaultValue: string;
}

export function SearchInput({ defaultValue }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    
    const params = new URLSearchParams(searchParams);
    
    if (search?.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    // Reset to first page when searching
    params.delete("page");

    const paramString = params.toString();
    router.push(`/users${paramString ? `?${paramString}` : ""}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
      <input
        key={defaultValue} // Force re-render when defaultValue changes
        type="text"
        name="search"
        placeholder="Buscar por nome ou email..."
        defaultValue={defaultValue}
        className="w-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-400"
      />
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-blue-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <button
        type="submit"
        className="absolute right-2 top-1.5 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Buscar
      </button>
    </form>
  );
}

interface SortToggleProps {
  currentOrder: string;
}

export function SortToggle({ currentOrder }: SortToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleToggle = () => {
    const params = new URLSearchParams(searchParams);
    const newOrder = currentOrder === "asc" ? "desc" : "asc";
    params.set("sortOrder", newOrder);

    const paramString = params.toString();
    router.push(`/users${paramString ? `?${paramString}` : ""}`);
  };

  return (
    <button
      onClick={handleToggle}
      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 text-blue-400"
      title={`Ordenar ${currentOrder === "asc" ? "descendente" : "ascendente"}`}
    >
      {currentOrder === "asc" ? "↑" : "↓"}
    </button>
  );
}