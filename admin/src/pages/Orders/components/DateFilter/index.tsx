import { HiCalendar, HiX } from 'react-icons/hi';

type QuickFilter = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | '';

interface DateFilterProps {
    dateFrom: string;
    dateTo: string;
    onDateChange: (from: string, to: string) => void;
}

const QUICK_FILTERS: { value: QuickFilter; label: string }[] = [
    { value: 'today', label: 'Bugün' },
    { value: 'yesterday', label: 'Dün' },
    { value: 'thisWeek', label: 'Bu Hafta' },
    { value: 'lastWeek', label: 'Geçen Hafta' },
    { value: 'thisMonth', label: 'Bu Ay' },
];

function getDateRange(filter: QuickFilter): { from: string; to: string } {
    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    switch (filter) {
        case 'today':
            return { from: formatDate(today), to: formatDate(today) };
        case 'yesterday': {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return { from: formatDate(yesterday), to: formatDate(yesterday) };
        }
        case 'thisWeek': {
            const startOfWeek = new Date(today);
            const day = startOfWeek.getDay();
            const diff = day === 0 ? 6 : day - 1; // Monday as start
            startOfWeek.setDate(startOfWeek.getDate() - diff);
            return { from: formatDate(startOfWeek), to: formatDate(today) };
        }
        case 'lastWeek': {
            const startOfThisWeek = new Date(today);
            const day2 = startOfThisWeek.getDay();
            const diff2 = day2 === 0 ? 6 : day2 - 1;
            startOfThisWeek.setDate(startOfThisWeek.getDate() - diff2);

            const startOfLastWeek = new Date(startOfThisWeek);
            startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
            const endOfLastWeek = new Date(startOfThisWeek);
            endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);
            return { from: formatDate(startOfLastWeek), to: formatDate(endOfLastWeek) };
        }
        case 'thisMonth': {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            return { from: formatDate(startOfMonth), to: formatDate(today) };
        }
        default:
            return { from: '', to: '' };
    }
}

function getActiveQuickFilter(dateFrom: string, dateTo: string): QuickFilter {
    for (const filter of QUICK_FILTERS) {
        const range = getDateRange(filter.value);
        if (range.from === dateFrom && range.to === dateTo) {
            return filter.value;
        }
    }
    return '';
}

export default function DateFilter({ dateFrom, dateTo, onDateChange }: DateFilterProps) {
    const activeQuickFilter = getActiveQuickFilter(dateFrom, dateTo);
    const hasActiveFilter = dateFrom || dateTo;

    const handleQuickFilter = (filter: QuickFilter) => {
        if (filter === activeQuickFilter) {
            // Deselect — clear filter
            onDateChange('', '');
            return;
        }
        const range = getDateRange(filter);
        onDateChange(range.from, range.to);
    };

    const handleClear = () => {
        onDateChange('', '');
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <HiCalendar className="text-gray-400" />
                    Tarih Filtresi
                </div>
                {hasActiveFilter && (
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                    >
                        <HiX size={14} />
                        Temizle
                    </button>
                )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
                {QUICK_FILTERS.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => handleQuickFilter(filter.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${activeQuickFilter === filter.value
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Custom Date Range */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 whitespace-nowrap">Başlangıç:</label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => onDateChange(e.target.value, dateTo)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 whitespace-nowrap">Bitiş:</label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => onDateChange(dateFrom, e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
}
