import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon, PieChartIcon } from 'lucide-react';
import ChartCard from '../ChartCard';

const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4'];

const ChartSection = ({ barChartData, pieChartData, lineChartData }) => {
    // Use simple colors instead of CSS variables for better compatibility
    const axisColor = "#374151"; // gray-700
    const gridColor = "#E5E7EB"; // gray-200

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Bar Chart (Sales by Region) */}
            <ChartCard title="Sales by Region" icon={BarChart3}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="Region" stroke={axisColor} />
                        <YAxis stroke={axisColor} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Chart 2: Line Chart (Monthly Sales & Profit Trend) */}
            <ChartCard title="Monthly Sales & Profit Trend" icon={LineChartIcon}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="month" stroke={axisColor} />
                        <YAxis yAxisId="left" stroke="#10b981" />
                        <YAxis yAxisId="right" orientation="right" stroke="#f97316" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="totalSales" stroke="#10b981" activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="totalProfit" stroke="#f97316" />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Chart 3: Pie Chart (Items by Category Distribution) */}
            <ChartCard title="Items by Category" icon={PieChartIcon}>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            dataKey="Items"
                            nameKey="Category"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
};

export default ChartSection;