import React, { useState } from 'react';
import { Moon, Sun, Loader2 } from 'lucide-react';
import { authAPI } from '../services/api';

const AuthScreen = ({ onLogin, isLoading, toggleTheme, theme }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            let userData;
            if (isLoginView) {
                const response = await authAPI.login(email, password);
                localStorage.setItem('access_token', response.access_token);
                userData = await authAPI.getCurrentUser();
            } else {
                userData = await authAPI.register(email, password);
                // Auto-login after registration
                const loginResponse = await authAPI.login(email, password);
                localStorage.setItem('access_token', loginResponse.access_token);
            }
            
            onLogin(true, userData.role);
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <div className="absolute top-4 right-4">
                <button onClick={toggleTheme} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition-all duration-300">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                    {isLoginView ? 'Sign In' : 'Sign Up'}
                </h2>
                
                {error && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder={isLoginView ? "admin@test.com or member@test.com" : "Enter your email"}
                        disabled={isLoading}
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder={isLoginView ? "adminpass or memberpass" : "Create a password"}
                        disabled={isLoading}
                        required
                    />
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-150"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            isLoginView ? 'Sign In' : 'Sign Up'
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <button
                        onClick={() => setIsLoginView(!isLoginView)}
                        className="text-blue-600 hover:text-blue-500 font-medium transition"
                        disabled={isLoading}
                    >
                        {isLoginView ? 'Need an account? Sign Up' : 'Have an account? Sign In'}
                    </button>
                </p>
                
                {isLoginView && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        <p>Demo accounts:</p>
                        <p>Admin: admin@test.com / adminpass</p>
                        <p>Member: member@test.com / memberpass</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthScreen;