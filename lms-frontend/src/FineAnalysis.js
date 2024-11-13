import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import './FineAnalysis.css';

import { Chart } from 'chart.js';
Chart.register(ChartDataLabels);

const FineAnalysis = () => {
    const [fineData, setFineData] = useState(null);
    const [reservationData, setReservationData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFineData();
        fetchReservationData();
    }, []);

    const fetchFineData = () => {
        axios.get('http://localhost:8000/api/loans/fine_analysis/')
            .then(response => setFineData(response.data))
            .catch(err => setError('There was an error fetching fine data'));
    };

    const fetchReservationData = () => {
        axios.get('http://localhost:8000/api/reservations/status_analysis/')
            .then(response => setReservationData(response.data))
            .catch(err => setError('There was an error fetching reservation data'));
    };

    if (error) return <p>{error}</p>;
    if (!fineData || !reservationData) return <p>Loading data...</p>;

    const { pending_fines, collected_fines } = fineData;
    const { Pending, Loaned, Cancelled } = reservationData;

    const finePieData = {
        labels: ['Pending Fines', 'Collected Fines'],
        datasets: [
            {
                label: 'Fine Distribution',
                data: [pending_fines, collected_fines],
                backgroundColor: ['#ff6384', '#36a2eb'],
                hoverBackgroundColor: ['#ff6384', '#36a2eb'],
            },
        ],
    };

    const fineBarData = {
        labels: ['Pending Fines', 'Collected Fines'],
        datasets: [
            {
                label: 'Fine Amount',
                data: [pending_fines, collected_fines],
                backgroundColor: ['#ff6384', '#36a2eb'],
                borderColor: ['#ff6384', '#36a2eb'],
                borderWidth: 1,
            },
        ],
    };

    const statusPieData = {
        labels: ['Pending', 'Loaned', 'Cancelled'],
        datasets: [
            {
                label: 'Reservation Status',
                data: [Pending, Loaned, Cancelled],
                backgroundColor: ['#ffa500', '#36a2eb', '#ff6347'],
                hoverBackgroundColor: ['#ffa500', '#36a2eb', '#ff6347'],
            },
        ],
    };

    const pieOptions = {
        plugins: {
            datalabels: {
                color: '#fff',
                formatter: (value, context) => {
                    const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                    const percentage = (value / total * 100).toFixed(1) + '%';
                    return percentage;
                },
                font: {
                    weight: 'bold',
                    size: 14,
                },
            },
            legend: {
                position: 'bottom',
            },
        },
    };

    return (
        <div className="fine-analysis-container">
            <h2>Fine Analysis & Reservation Status</h2>

            <div className="chart-container pie-chart">
                <h3 className="chart-title">Fine Distribution</h3>
                <Pie data={finePieData} options={pieOptions} />
            </div>

            <div className="chart-container bar-chart">
                <h3 className="chart-title">Fine Amount</h3>
                <Bar data={fineBarData} options={{ maintainAspectRatio: false }} />
            </div>

            <div className="chart-container status-chart">
                <h3 className="chart-title">Reservation Status Distribution</h3>
                <Pie data={statusPieData} options={pieOptions} />
            </div>
        </div>
    );
};

export default FineAnalysis;
