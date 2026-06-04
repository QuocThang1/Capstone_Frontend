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

const WorkloadChart = ({ labels, datasets }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'To Do',
                data: datasets.todo,
                backgroundColor: 'rgba(156, 163, 175, 0.8)', // Slate 400
                borderColor: 'rgb(156, 163, 175)',
                borderWidth: 1
            },
            {
                label: 'In Progress',
                data: datasets.inprogress,
                backgroundColor: 'rgba(234, 179, 8, 0.8)', // Yellow 500
                borderColor: 'rgb(234, 179, 8)',
                borderWidth: 1
            },
            {
                label: 'Done',
                data: datasets.done,
                backgroundColor: 'rgba(16, 185, 129, 0.8)', // Emerald 500
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1
            }
        ]
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
