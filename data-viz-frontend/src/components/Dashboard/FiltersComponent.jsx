import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const FiltersComponent = ({ filters, setFilters, uniqueCategories }) => {
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-wrap gap-4 items-center">
            <SlidersHorizontal className="text-blue-500 h-5 w-5" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Filters:</span>

            {/* General Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search all data..."
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                />
            </div>

            {/* Category Dropdown Filter */}
            <div className="relative min-w-[150px]">
                <select
                    value={filters.categoryFilter}
                    onChange={(e) => handleFilterChange('categoryFilter', e.target.value)}
                    className="w-full appearance-none pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                >
                    <option value="">All Categories</option>
                    {uniqueCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            
            <button
                onClick={() => setFilters({ searchQuery: '', categoryFilter: '' })}
                className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900 transition"
            >
                Clear Filters
            </button>
        </div>
    );
};

export default FiltersComponent;