import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const generateColor = (index, total) => {
    const colors = [
        'rgba(156, 163, 175, 0.8)', // Slate
        'rgba(59, 130, 246, 0.8)', // Blue
        'rgba(234, 179, 8, 0.8)', // Yellow
        'rgba(249, 115, 22, 0.8)', // Orange
        'rgba(139, 92, 246, 0.8)', // Violet
    ];
    
    // Ensure the last column always gets Emerald (Done-like color)
    if (index === total - 1 && total > 1) return 'rgba(16, 185, 129, 0.8)';
    
    return colors[index % colors.length];
};

const WorkloadChart = ({ labels, datasets }) => {
    const data = {
        labels: labels,
        datasets: Array.isArray(datasets) ? datasets.map((ds, index) => {
            const bgColor = generateColor(index, datasets.length);
            return {
                label: ds.label,
                data: ds.data,
                backgroundColor: bgColor,
                borderColor: bgColor.replace('0.8)', '1)'),
                borderWidth: 1
            };
        }) : []
    };

    const options = {
        indexAxis: 'y', // Makes the bar chart horizontal
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
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
                        return `${context.dataset.label}: ${context.parsed.x} points`;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Total Story Points',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 13,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(226, 232, 240, 0.5)',
                }
            },
            y: {
                stacked: true,
                ticks: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 13
                    }
                },
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="w-full h-[400px]">
            <Bar data={data} options={options} />
        </div>
    );
};

export default WorkloadChart;
