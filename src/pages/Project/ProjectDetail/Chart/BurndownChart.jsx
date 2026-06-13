import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const BurndownChart = ({ labels, idealData, actualData, totalPoints }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Actual Remaining',
                data: actualData,
                borderColor: 'rgb(99, 102, 241)', // Indigo 500
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                pointBackgroundColor: 'rgb(99, 102, 241)',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0, // step line effect by setting tension to 0
                stepped: true // Giật cục khi kéo sang Done
            },
            {
                label: 'Ideal Guideline',
                data: idealData,
                borderColor: 'rgba(156, 163, 175, 0.8)', // Gray 400
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false,
                tension: 0
            }
        ],
    };

    const options = {
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
                        return `${context.dataset.label}: ${context.parsed.y} points`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: totalPoints ? totalPoints + 2 : 10,
                title: {
                    display: true,
                    text: 'Story Points',
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
            x: {
                title: {
                    display: true,
                    text: 'Days',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 13,
                        weight: 'bold'
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
            <Line data={data} options={options} />
        </div>
    );
};

export default BurndownChart;
