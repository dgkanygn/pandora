import { useState, useEffect, useCallback } from 'react';
import { HiTrendingUp, HiCurrencyDollar, HiClock, HiCheckCircle, HiTruck, HiXCircle } from 'react-icons/hi';
import { ordersAPI } from '../../services/api';
import type { OrderStats, StatsPeriod } from '../../services/api';

const PERIODS: { value: StatsPeriod; label: string }[] = [
    { value: 'today', label: 'Bugün' },
    { value: 'week', label: 'Son 7 Gün' },
    { value: 'month', label: 'Son 30 Gün' },
    { value: 'all_time', label: 'Tüm Zamanlar' },
];

export default function OrderStatsWidget() {
    const [period, setPeriod] = useState<StatsPeriod>('month');
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = useCallback(async (p: StatsPeriod) => {
        setIsLoading(true);
        try {
            const data = await ordersAPI.getStats(p);
            setStats(data);
        } catch (error) {
            console.error('Stats fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats(period);
    }, [period, fetchStats]);

    const handlePeriodChange = (p: StatsPeriod) => {
        setPeriod(p);
    };

    const statusCards = [
        {
            label: 'Bekleyen',
            value: stats?.byStatus?.pending?.count ?? 0,
            icon: HiClock,
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-700',
            iconBg: 'bg-yellow-100',
        },
        {
            label: 'Ödendi',
            value: stats?.byStatus?.paid?.count ?? 0,
            icon: HiCheckCircle,
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            iconBg: 'bg-blue-100',
        },
        {
            label: 'Kargoda',
            value: stats?.byStatus?.shipped?.count ?? 0,
            icon: HiTruck,
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            iconBg: 'bg-purple-100',
        },
        {
            label: 'Teslim Edildi',
            value: stats?.byStatus?.delivered?.count ?? 0,
            icon: HiCheckCircle,
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-700',
            iconBg: 'bg-green-100',
        },
        {
            label: 'İptal',
            value: stats?.byStatus?.cancelled?.count ?? 0,
            icon: HiXCircle,
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-700',
            iconBg: 'bg-red-100',
        },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            {/* Header with period selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Sipariş İstatistikleri</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Dönem bazlı sipariş özeti</p>
                </div>

                {/* Period Tabs */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 self-start sm:self-auto">
                    {PERIODS.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => handlePeriodChange(p.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${period === p.value
                                ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading skeleton */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 animate-pulse">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-xl" />
                    ))}
                </div>
            ) : (
                <>
                    {/* Summary row: Total & Revenue */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 text-white flex items-center gap-3">
                            <div className="flex-shrink-0 bg-white/20 rounded-lg p-2">
                                <HiTrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <div className="text-xs text-indigo-100">Toplam Sipariş</div>
                                <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
                            </div>
                        </div>
                        <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 text-white flex items-center gap-3">
                            <div className="flex-shrink-0 bg-white/20 rounded-lg p-2">
                                <HiCurrencyDollar className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <div className="text-xs text-emerald-100">Toplam Gelir</div>
                                <div className="text-xl font-bold">
                                    ₺{(stats?.totalRevenue ?? 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {statusCards.map((card) => (
                            <div
                                key={card.label}
                                className={`rounded-xl border ${card.bg} ${card.border} p-3 flex items-center gap-3`}
                            >
                                <div className={`flex-shrink-0 ${card.iconBg} rounded-lg p-1.5`}>
                                    <card.icon className={`h-4 w-4 ${card.text}`} />
                                </div>
                                <div>
                                    <div className={`text-xs ${card.text} font-medium`}>{card.label}</div>
                                    <div className={`text-xl font-bold ${card.text}`}>{card.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
