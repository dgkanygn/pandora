import { useState, useMemo } from 'react';
import { HiChevronUp, HiChevronDown, HiChevronLeft, HiChevronRight, HiChevronDoubleRight, HiChevronDoubleLeft } from 'react-icons/hi';

export interface Column<T> {
    key: keyof T | string;
    header: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    itemsPerPage?: number;
    onEdit?: (item: T) => void;
    onDelete?: (id: string) => void;
    getRowId: (item: T) => string;
    emptyMessage?: string;
    renderActions?: (item: T) => React.ReactNode;
    filterOptions?: {
        key: string;
        label: string;
        options: { value: string; label: string }[];
    };
    onFilterChange?: (value: string) => void;
    currentFilter?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export default function DataTable<T>({
    data,
    columns,
    itemsPerPage = 15,
    getRowId,
    emptyMessage = 'Veri bulunamadı.',
    renderActions,
    filterOptions,
    onFilterChange,
    currentFilter = '',
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    // Reset to page 1 when data changes
    useMemo(() => {
        setCurrentPage(1);
    }, [data.length, currentFilter]);

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortKey || !sortDirection) return data;

        return [...data].sort((a, b) => {
            const aValue = getNestedValue(a, sortKey);
            const bValue = getNestedValue(b, sortKey);

            // Handle null/undefined
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
            if (bValue == null) return sortDirection === 'asc' ? -1 : 1;

            // String comparison
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue, 'tr')
                    : bValue.localeCompare(aValue, 'tr');
            }

            // Number comparison
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }

            // Boolean comparison
            if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                return sortDirection === 'asc'
                    ? (aValue === bValue ? 0 : aValue ? -1 : 1)
                    : (aValue === bValue ? 0 : aValue ? 1 : -1);
            }

            // Date comparison
            if (aValue instanceof Date && bValue instanceof Date) {
                return sortDirection === 'asc'
                    ? aValue.getTime() - bValue.getTime()
                    : bValue.getTime() - aValue.getTime();
            }

            // Fallback: convert to string
            const aStr = String(aValue);
            const bStr = String(bValue);
            return sortDirection === 'asc'
                ? aStr.localeCompare(bStr, 'tr')
                : bStr.localeCompare(aStr, 'tr');
        });
    }, [data, sortKey, sortDirection]);

    // Paginate data
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage]);

    // Handle sort
    const handleSort = (key: string) => {
        if (sortKey === key) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                setSortKey(null);
                setSortDirection(null);
            }
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    // Get nested value (e.g., 'category.name')
    function getNestedValue(obj: T, path: string): unknown {
        return path.split('.').reduce((acc: unknown, part) => {
            if (acc && typeof acc === 'object' && part in acc) {
                return (acc as Record<string, unknown>)[part];
            }
            return undefined;
        }, obj);
    }

    // Render sort icon
    const renderSortIcon = (key: string) => {
        const isActive = sortKey === key;

        return (
            <span className="ml-2 inline-flex flex-col space-y-[2px] items-center text-gray-400">
                <HiChevronUp
                    size={15}
                    className={`${isActive && sortDirection === 'asc' ? 'text-indigo-600' : 'opacity-40'} -mb-[4px]`}
                />
                <HiChevronDown
                    size={15}
                    className={`${isActive && sortDirection === 'desc' ? 'text-indigo-600' : 'opacity-40'} -mt-[4px]`}
                />
            </span>
        );
    };

    // Empty state - show filter if available, then empty message
    if (data.length === 0) {
        return (
            <div className="space-y-4">
                {/* Filter - still show when empty */}
                {filterOptions && (
                    <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4">
                        <label className="text-sm font-medium text-gray-700">{filterOptions.label}:</label>
                        <select
                            value={currentFilter}
                            onChange={(e) => onFilterChange?.(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            {filterOptions.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <span className="ml-auto text-sm text-gray-500">
                            Toplam: <span className="font-semibold text-gray-700">0</span> kayıt
                        </span>
                    </div>
                )}
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filter */}
            {filterOptions && (
                <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4">
                    <label className="text-sm font-medium text-gray-700">{filterOptions.label}:</label>
                    <select
                        value={currentFilter}
                        onChange={(e) => onFilterChange?.(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        {filterOptions.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <span className="ml-auto text-sm text-gray-500">
                        Toplam: <span className="font-semibold text-gray-700">{sortedData.length}</span> kayıt
                    </span>
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={String(column.key)}
                                        scope="col"
                                        className={`px-6 py-3 ${column.sortable ? 'cursor-pointer select-none group hover:bg-gray-100 transition-colors' : ''} ${column.className || ''}`}
                                        onClick={() => column.sortable && handleSort(String(column.key))}
                                    >
                                        <div className="flex items-center">
                                            {column.header}
                                            {column.sortable && renderSortIcon(String(column.key))}
                                        </div>
                                    </th>
                                ))}
                                {renderActions && (
                                    <th scope="col" className="px-6 py-3 text-right">
                                        İşlemler
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 border-t border-gray-200">
                            {paginatedData.map((item) => (
                                <tr key={getRowId(item)} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((column) => (
                                        <td
                                            key={`${getRowId(item)}-${String(column.key)}`}
                                            className={`px-6 py-4 ${column.className || ''}`}
                                        >
                                            {column.render
                                                ? column.render(item)
                                                : String(getNestedValue(item, String(column.key)) ?? '-')}
                                        </td>
                                    ))}
                                    {renderActions && (
                                        <td className="px-6 py-4 text-right">
                                            {renderActions(item)}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center bg-white rounded-xl border border-gray-200 px-6 py-4">
                    {/* <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">{(currentPage - 1) * itemsPerPage + 1}</span>
                        {' - '}
                        <span className="font-medium text-gray-700">
                            {Math.min(currentPage * itemsPerPage, sortedData.length)}
                        </span>
                        {' / '}
                        <span className="font-medium text-gray-700">{sortedData.length}</span>
                        {' kayıt gösteriliyor'}
                    </div> */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="flex p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="İlk sayfa"
                        >
                            {/* <HiChevronLeft size={16} />
                            <HiChevronLeft size={16} className="" /> */}

                            <HiChevronDoubleLeft />
                        </button>
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Önceki sayfa"
                        >
                            <HiChevronLeft size={16} />
                        </button>
                        <div className="flex items-center gap-1">
                            {generatePageNumbers(currentPage, totalPages).map((page, index) =>
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page as number)}
                                        className={`min-w-[36px] h-9 rounded-lg border text-sm font-medium transition-colors ${currentPage === page
                                            ? 'bg-indigo-600 border-indigo-600 text-white'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}
                        </div>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Sonraki sayfa"
                        >
                            <HiChevronRight size={16} />
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Son sayfa"
                        >
                            {/* <HiChevronRight size={16} />
                            <HiChevronRight size={16} className="" /> */}
                            <HiChevronDoubleRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper function to generate page numbers with ellipsis
function generatePageNumbers(current: number, total: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const showEllipsis = total > 7;

    if (!showEllipsis) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
        return pages;
    }

    // Always show first page
    pages.push(1);

    if (current > 3) {
        pages.push('...');
    }

    // Show pages around current
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
            pages.push(i);
        }
    }

    if (current < total - 2) {
        pages.push('...');
    }

    // Always show last page
    if (!pages.includes(total)) {
        pages.push(total);
    }

    return pages;
}
