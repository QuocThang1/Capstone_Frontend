import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const IssueTypeChart = ({ labels, data }) => {
    // Colors mapped commonly to issue types: 
    // Bug: Red, Task: Blue, Story: Green, Epic: Purple, Other: Orange
    const colorMap = {
        'Bug': 'rgba(239, 68, 68, 0.8)',      // Red 500
        'Task': 'rgba(59, 130, 246, 0.8)',     // Blue 500
        'Story': 'rgba(16, 185, 129, 0.8)',    // Emerald 500
        'Epic': 'rgba(139, 92, 246, 0.8)',     // Violet 500
        'Other': 'rgba(245, 158, 11, 0.8)'     // Amber 500
    };

    const borderColors = {
        'Bug': 'rgb(239, 68, 68)',
        'Task': 'rgb(59, 130, 246)',
        'Story': 'rgb(16, 185, 129)',
        'Epic': 'rgb(139, 92, 246)',
        'Other': 'rgb(245, 158, 11)'
    };

    const backgroundColors = labels.map(label => colorMap[label] || colorMap['Other']);
    const borders = labels.map(label => borderColors[label] || borderColors['Other']);

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borders,
                borderWidth: 1,
                hoverOffset: 4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%', // makes it a Doughnut instead of Pie
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 13
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { family: "'Inter', sans-serif", size: 13 },
                bodyFont: { family: "'Inter', sans-serif", size: 13 },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        return ` ${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="w-full h-[300px] flex items-center justify-center">
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default IssueTypeChart;
