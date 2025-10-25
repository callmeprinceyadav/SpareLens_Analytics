import React, { useState, useMemo, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const DataTable = ({ data, userRole }) => {
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    // Initialize tableData when prop `data` changes
    useEffect(() => {
        setTableData(data);
    }, [data]);

    // Columns (skip 'id')
    const columns = tableData.length > 0 ? Object.keys(tableData[0]).filter(c => c !== 'id') : [];

    // Sorting Logic
    const sortedData = useMemo(() => {
        const sortableData = [...tableData];
        if (sortConfig.key !== null) {
            sortableData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableData;
    }, [tableData, sortConfig]);

    // Pagination Logic
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const currentData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Sort request
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Sort icon
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />;
    };

    // Delete row
    const deleteRow = (id) => {
        setTableData(prev => prev.filter(row => row.id !== id));
        // Adjust page if last row deleted
        if ((currentPage - 1) * pageSize >= tableData.length - 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <div className="space-y-4">
            {tableData.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-300">No data available.</div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {columns.map(column => (
                                        <th
                                            key={column}
                                            onClick={() => requestSort(column)}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                                        >
                                            <div className="flex items-center">
                                                {column}
                                                {getSortIcon(column)}
                                            </div>
                                        </th>
                                    ))}
                                    {userRole === 'Admin' && (
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Admin Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {currentData.map(row => (
                                    <tr key={row.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors duration-150">
                                        {columns.map(column => (
                                            <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                {row[column]}
                                            </td>
                                        ))}
                                        {userRole === 'Admin' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => deleteRow(row.id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    Delete Row
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DataTable;
