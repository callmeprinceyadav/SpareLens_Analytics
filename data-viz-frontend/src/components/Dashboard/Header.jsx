import React from 'react';
import { Upload, Sun, Moon, LogOut, Loader2, Shield, User } from 'lucide-react';

const Header = ({ dataName, onLogout, toggleTheme, theme, userRole, handleFileUpload, isUploading }) => (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow dark:shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <h1 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                    Data Visualization Dashboard 
                </h1>
                
                <div className="flex items-center space-x-4">
                    {/* Role Display */}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        userRole === 'Admin' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300' : 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300'
                    } flex items-center`}>
                        {userRole === 'Admin' ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                        Role: {userRole}
                    </span>

                    {/* File Upload Button (Admin Only - RBAC) */}
                    {userRole === 'Admin' && (
                        <label className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                            isUploading ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer transition'
                        }`}>
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    <span>Upload Data</span>
                                </>
                            )}
                            <input 
                                type="file" 
                                accept=".csv, .xlsx, .xls" 
                                onChange={handleFileUpload} 
                                disabled={isUploading}
                                className="hidden" 
                            />
                        </label>
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={onLogout}
                        className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                        aria-label="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </div>
    </header>
);

export default Header;