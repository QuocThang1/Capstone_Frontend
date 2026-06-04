import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const VelocityChart = ({ labels, datasets }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Assigned Points',
                data: datasets.assigned,
                backgroundColor: 'rgba(59, 130, 246, 0.2)', // Blue
                borderColor: 'rgb(59, 130, 246)',
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(59, 130, 246)'
            },
            {
                label: 'Completed On Time',
                data: datasets.onTime,
                backgroundColor: 'rgba(16, 185, 129, 0.2)', // Emerald
                borderColor: 'rgb(16, 185, 129)',
                pointBackgroundColor: 'rgb(16, 185, 129)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(16, 185, 129)'
            },
            {
                label: 'Completed Late',
                data: datasets.late,
                backgroundColor: 'rgba(239, 68, 68, 0.2)', // Red
                borderColor: 'rgb(239, 68, 68)',
                pointBackgroundColor: 'rgb(239, 68, 68)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(239, 68, 68)'
            }
        ]
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
                        return `${context.dataset.label}: ${context.parsed.r} points`;
                    }
                }
            }
        },
        scales: {
            r: {
                angleLines: {
                    display: true,
                    color: 'rgba(226, 232, 240, 0.5)'
                },
                grid: {
                    color: 'rgba(226, 232, 240, 0.5)'
                },
                pointLabels: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 13,
                        weight: '500'
                    }
                },
                ticks: {
                    display: false,
                    stepSize: 5
                }
            }
        }
    };

    return (
        <div className="w-full h-[450px]">
            <Radar data={data} options={options} />
        </div>
    );
};

export default VelocityChart;
