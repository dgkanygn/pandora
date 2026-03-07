import { HiPencil, HiTrash } from 'react-icons/hi';

interface Neighborhood {
    id: string;
    name: string;
    price: number;
}

interface NeighborhoodListProps {
    neighborhoods: Neighborhood[];
    onDelete: (id: string) => void;
    onEdit: (neighborhood: Neighborhood) => void;
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
}

export default function NeighborhoodList({ neighborhoods, onDelete, onEdit, hasMore, isLoadingMore, onLoadMore }: NeighborhoodListProps) {
    if (neighborhoods.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500">Henüz semt bulunmuyor.</p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Semt Adı</th>
                                <th scope="col" className="px-6 py-3">Ekstra Fiyat</th>
                                <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 border-t border-gray-200">
                            {neighborhoods.map((neighborhood) => (
                                <tr key={neighborhood.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{neighborhood.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(neighborhood.price)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => onEdit(neighborhood)}
                                                className="text-indigo-600 hover:text-indigo-900 cursor-pointer p-1 rounded-lg hover:bg-indigo-50 transition-colors"
                                                title="Düzenle"
                                            >
                                                <HiPencil size={20} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(neighborhood.id)}
                                                className="text-red-600 hover:text-red-900 cursor-pointer p-1 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Sil"
                                            >
                                                <HiTrash size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-center py-4">
                {hasMore ? (
                    <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md cursor-pointer"
                    >
                        {isLoadingMore ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Yükleniyor...
                            </>
                        ) : (
                            'Daha Fazla Yükle'
                        )}
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                        <span className="text-sm">Tüm veriler yüklendi</span>
                        <span className="text-xs text-gray-400">({neighborhoods.length} kayıt)</span>
                    </div>
                )}
            </div>
        </>
    );
}
