import React, { useState, useMemo, useEffect } from 'react';
import { Table, LayoutList, Loader2, BarChart3 } from 'lucide-react';

// Import Modular Components/Hooks
import useTheme from './hooks/useTheme';
import AuthScreen from './components/AuthScreen';
import Header from './components/Dashboard/Header';
import FiltersComponent from './components/Dashboard/FiltersComponent';
import DataTable from './components/Dashboard/DataTable';
import ChartSection from './components/Charts/ChartSection';
import TabButton from './components/TabButton';
import { dataAPI, authAPI } from './services/api';

// --- UTILITY DATA & FUNCTIONS ---

const initialMockData = [
  { id: 1, Region: 'North', Sales: 12000, Profit: 3000, Items: 150, Date: '2023-01-01', Category: 'Electronics' },
  { id: 2, Region: 'South', Sales: 8500, Profit: 1200, Items: 90, Date: '2023-01-05', Category: 'Apparel' },
  { id: 3, Region: 'East', Sales: 15000, Profit: 4500, Items: 220, Date: '2023-02-10', Category: 'Electronics' },
  { id: 4, Region: 'West', Sales: 9200, Profit: 2800, Items: 110, Date: '2023-02-15', Category: 'Home Goods' },
  { id: 5, Region: 'North', Sales: 11500, Profit: 2900, Items: 130, Date: '2023-03-01', Category: 'Apparel' },
  { id: 6, Region: 'South', Sales: 7800, Profit: 1000, Items: 80, Date: '2023-03-05', Category: 'Home Goods' },
  { id: 7, Region: 'East', Sales: 16000, Profit: 5000, Items: 250, Date: '2023-04-10', Category: 'Electronics' },
  { id: 8, Region: 'West', Sales: 8800, Profit: 2500, Items: 100, Date: '2023-04-15', Category: 'Apparel' },
];

// --- Dashboard Component (Handles main data state) ---

const DashboardLayout = ({ onLogout, userRole, toggleTheme, theme }) => {
    const [activeTab, setActiveTab] = useState('charts');
    const [rawTableData, setRawTableData] = useState([]);
    const [dataName, setDataName] = useState('No Data Loaded');
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentFileId, setCurrentFileId] = useState(null);
    const [userFiles, setUserFiles] = useState([]);

    // Filtering State
    const [filters, setFilters] = useState({
        searchQuery: '',
        categoryFilter: '',
    });

    // Load user files on component mount
    useEffect(() => {
        loadUserFiles();
    }, []);

    const loadUserFiles = async () => {
        try {
            const response = await dataAPI.getFiles();
            setUserFiles(response.files);
            
            // If user has files, load the first one by default
            if (response.files.length > 0) {
                const firstFile = response.files[0];
                setCurrentFileId(firstFile.file_id);
                setDataName(firstFile.file_name);
                await loadFileData(firstFile.file_id);
            } else {
                // Load mock data if no files uploaded
                setRawTableData(initialMockData);
                setDataName('Sample Sales Data');
            }
        } catch (err) {
            console.error('Error loading files:', err);
            // Fallback to mock data
            setRawTableData(initialMockData);
            setDataName('Sample Sales Data');
        }
    };

    const loadFileData = async (fileId) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await dataAPI.processData(fileId, {
                page: 1,
                pageSize: 1000, // Load all data for visualization
                searchQuery: filters.searchQuery,
                columnFilters: filters.categoryFilter ? [{
                    column: 'Category',
                    value: [filters.categoryFilter],
                    operator: 'in'
                }] : []
            });
            
            setRawTableData(response.table_data);
            setCurrentFileId(fileId);
        } catch (err) {
            setError('Error loading data: ' + (err.response?.data?.detail || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    // Fetches/Processes data based on filters
    const { tableData, barChartData, pieChartData, lineChartData } = useMemo(() => {
        if (!rawTableData.length) {
            return { tableData: [], barChartData: [], pieChartData: [], lineChartData: [] };
        }

        let filteredData = rawTableData.filter(item => {
            const matchesSearch = !filters.searchQuery || 
              Object.values(item).some(value => 
                String(value).toLowerCase().includes(filters.searchQuery.toLowerCase())
              );
            const matchesCategory = !filters.categoryFilter || item.Category === filters.categoryFilter;
            return matchesSearch && matchesCategory;
        });

        // Aggregations for charts
        const salesByRegionMap = filteredData.reduce((acc, item) => { 
            acc[item.Region] = (acc[item.Region] || 0) + item.Sales; 
            return acc; 
        }, {});
        const barChartData = Object.keys(salesByRegionMap).map(region => ({ 
            Region: region, 
            Sales: salesByRegionMap[region] 
        }));
        
        const itemsByCategoryMap = filteredData.reduce((acc, item) => { 
            acc[item.Category] = (acc[item.Category] || 0) + item.Items; 
            return acc; 
        }, {});
        const pieChartData = Object.keys(itemsByCategoryMap).map(category => ({ 
            Category: category, 
            Items: itemsByCategoryMap[category] 
        }));
        
        const monthlyData = filteredData.reduce((acc, item) => {
            const month = item.Date.substring(0, 7); 
            if (!acc[month]) { 
                acc[month] = { month, totalSales: 0, totalProfit: 0 }; 
            }
            acc[month].totalSales += item.Sales;
            acc[month].totalProfit += item.Profit;
            return acc;
        }, {});
        const lineChartData = Object.values(monthlyData).sort((a, b) => (a.month > b.month ? 1 : -1));

        return { tableData: filteredData, barChartData, pieChartData, lineChartData };
    }, [rawTableData, filters]);
    
    const uniqueCategories = useMemo(() => {
        const categories = rawTableData.map(d => d.Category).filter(Boolean);
        return [...new Set(categories)].sort();
    }, [rawTableData]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setError('');
        
        try {
            const response = await dataAPI.uploadFile(file);
            setDataName(file.name);
            setFilters({searchQuery: '', categoryFilter: ''}); // Reset filters after new data upload
            
            // Reload files list
            await loadUserFiles();
            
        } catch (err) {
            setError('Upload failed: ' + (err.response?.data?.detail || err.message));
        } finally {
            setIsUploading(false);
        }
    };

    const EmptyState = ({ isUploading }) => (
        <div className="text-center py-20 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
            {isUploading ? (
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-lg font-medium">Processing File...</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Data is being parsed and saved on the server.</p>
                </div>
            ) : (
                <>
                    <LayoutList className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium">No Data Loaded</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Please sign in as an Admin and use the 'Upload Data' button to start visualization.</p>
                </>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Header {...{ dataName, onLogout, toggleTheme, theme, userRole, handleFileUpload, isUploading }} />
            
            <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                        {error}
                    </div>
                )}
                
                <FiltersComponent {...{ filters, setFilters, uniqueCategories }} />
                
                <div className="mb-6 flex space-x-4 border-b border-gray-200 dark:border-gray-700">
                    <TabButton label="Visualizations" isActive={activeTab === 'charts'} onClick={() => setActiveTab('charts')} icon={BarChart3} />
                    <TabButton label="Data Table" isActive={activeTab === 'table'} onClick={() => setActiveTab('table')} icon={Table} />
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300">
                    {isLoading ? (
                        <div className="text-center py-10">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">Loading data...</p>
                        </div>
                    ) : rawTableData.length === 0 ? (
                         <EmptyState isUploading={isUploading} />
                    ) : tableData.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                            <p>No data found matching your filters. Please adjust your criteria.</p>
                        </div>
                    ) : activeTab === 'charts' ? (
                        <ChartSection 
                            barChartData={barChartData} 
                            pieChartData={pieChartData}
                            lineChartData={lineChartData}
                        />
                    ) : (
                        <DataTable data={tableData} userRole={userRole} />
                    )}
                </div>
            </div>
        </div>
    );
};

// Main App Container (Handles Auth)
const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userRole, setUserRole] = useState('Member');
    const { theme, toggleTheme } = useTheme();

    // Check for existing token on app load
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // Verify token is still valid by getting current user
            const verifyToken = async () => {
                try {
                    const userData = await authAPI.getCurrentUser();
                    setIsLoggedIn(true);
                    setUserRole(userData.role);
                } catch (err) {
                    localStorage.removeItem('access_token');
                }
            };
            verifyToken();
        }
    }, []);

    const handleAuth = (success, role) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoggedIn(success);
            setUserRole(role);
            setIsLoading(false);
        }, 1000);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
        setUserRole('Member');
    };

    if (!isLoggedIn) {
        return <AuthScreen onLogin={handleAuth} isLoading={isLoading} toggleTheme={toggleTheme} theme={theme} />;
    }

    return (
        <DashboardLayout 
            onLogout={handleLogout} 
            userRole={userRole}
            toggleTheme={toggleTheme} 
            theme={theme}
        />
    );
};

export default App;