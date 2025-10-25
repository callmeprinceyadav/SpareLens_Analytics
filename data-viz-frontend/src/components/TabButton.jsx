import React from 'react';
// Note: Icon component is assumed to be passed as a prop (e.g., from lucide-react)

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
            isActive
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
    >
        <Icon size={20} />
        <span>{label}</span>
    </button>
);

export default TabButton;