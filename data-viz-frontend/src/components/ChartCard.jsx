import React from 'react';

const ChartCard = ({ title, icon: Icon, children }) => (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-md transition-colors duration-300 border border-gray-200 dark:border-gray-700">
        <h3 className="flex items-center text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
            <Icon className="w-5 h-5 mr-2" />
            {title}
        </h3>
        {children}
    </div>
);

export default ChartCard;