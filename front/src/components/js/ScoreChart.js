import React from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const criteriaMap = {
    rawScore: '원점수',
    standardScore: '표준점수'
};

const ScoreChart = ({ scores, criteria }) => {
    const translatedCriteria = criteriaMap[criteria] || criteria; // 기준을 한글로 변환

    const data = {
        labels: scores.map(score => `${score.month} ${score.subject}`),
        datasets: [
            {
                type: 'line',
                label: '등급',
                data: scores.map(score => 10 - score.grade), // 등급을 반대로 변환
                borderColor: 'rgba(139, 69, 19, 1)', // 진갈색으로 변경
                borderWidth: 3, // 선의 두께를 더 두껍게 설정
                fill: false,
                yAxisID: 'y2',
                tension: 0.1,
                order: 1,
            },
            {
                type: 'bar',
                label: translatedCriteria,
                data: scores.map(score => score[criteria]),
                backgroundColor: scores.map((score) =>
                    score.subject === '국어' ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)'
                ),
                borderColor: scores.map((score) =>
                    score.subject === '국어' ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)'
                ),
                borderWidth: 1,
                yAxisID: 'y1',
                order: 2,
            },
        ],
    };

    const options = {
        scales: {
            y1: {
                beginAtZero: true,
                position: 'left',
                ticks: {
                    color: 'black',
                    font: {
                        weight: 'bold',
                    },
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
            y2: {
                position: 'right',
                min: 0,
                max: 10,
                ticks: {
                    stepSize: 1,
                    color: 'black',
                    font: {
                        weight: 'bold',
                    },
                    callback: function(value) {
                        return 10 - value; // 등급을 다시 원래 값으로 표시
                    }
                },
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            x: {
                ticks: {
                    color: 'black',
                    font: {
                        weight: 'bold',
                    },
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 20,
                    padding: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (context.dataset.yAxisID === 'y2') {
                            label += `: ${10 - context.raw}`; // 등급 툴팁 표시
                        } else {
                            label += `: ${context.raw}`;
                        }
                        return label;
                    }
                }
            }
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="chart-container" style={{ height: '450px', width: '70%', margin: '0 auto' }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ScoreChart;
