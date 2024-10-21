import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Header from '../../../../shared/header/Header';
import Footer from '../../../../shared/footer/Footer';
import { NavLink, useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TypingTestStats = () => {

    let stats = localStorage.getItem('stats')
    stats = JSON.parse(stats)
    const navigate = useNavigate();

    const {wpm, consistency, accuracy, correctChars, incorrectChars, extraChars, time} = stats;
    console.log("WPM:", wpm, "Consistency:", consistency, "Accuracy:", accuracy);

    const data = {
        labels: Array.from({ length: wpm.length }, (_, i) => i + 1), // X-axis label based on data length
        datasets: [
            // {
            //     label: 'WPM',
            //     data: wpm,
            //     borderColor: 'rgba(75, 192, 192, 1)',
            //     backgroundColor: 'rgba(75, 192, 192, 0.2)',
            //     fill: false,
            //     tension: 0.4,
            //     pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            // },
            {
                label: 'Consistency (%)',
                data: consistency,
                borderColor: 'rgba(113, 202, 199, 1)',
                backgroundColor: 'rgba(113, 202, 199, 0.2)',
                fill: false,
                tension: 0.4,
                pointBackgroundColor: 'rgba(113, 202, 199, 1)',
            },
            {
                label: 'Accuracy (%)',
                data: accuracy,
                borderColor: 'rgba(255, 255, 255, 1)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                fill: false,
                tension: 0.4,
                pointBackgroundColor: 'rgba(255, 255, 255, 1)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: 'Typing Test Statistics',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100, // Assuming percentages and WPM are capped at 100%
            },
        },
    };

    const repeatTest = () => {
        localStorage.removeItem('stats')
        if(localStorage.getItem('userToken')) {
            navigate('/user/lobby')
        } else {
            navigate('/')
        }
    }

    return(
        <>
            <Header />
            <section>
                <div className="container py-5">
                    <div className="row align-items-center py-4">
                        <div className="col-md-2">
                            <div className="statistics-layout">
                                <div>
                                    <h4>WPM</h4>
                                    <h1>{wpm[wpm?.length - 1]}</h1>
                                </div>
                                <div>
                                    <h4>Accuracy</h4>
                                    <h1>{accuracy[accuracy?.length - 1]}<span>%</span></h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-10 ">
                        <Line data={data} options={options}  height={30} width={"100%"}  />
                        </div>
                        <div className="col-md-12 py-5">
                            <div className="below-graph">
                                <div>
                                    <h4>Test Type</h4>
                                    <h1>time {time}</h1>
                                </div>
                                <div>
                                    <h4>Characters</h4>
                                    <h1>{`${correctChars}/${incorrectChars}/${extraChars}`}</h1>
                                </div>
                                <div>
                                    <h4>Consistency</h4>
                                    <h1>{consistency[consistency?.length - 1]}</h1>
                                </div>
                                <div>
                                    <h4>Time</h4>
                                    <h1>{time}s</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 py-5">
                            <div className="below-graph-btn">
                            <button><i className="fa-solid fa-download fa-xl" style={{ color: "#8c8c8c" }} /></button>
                            <button onClick={repeatTest}><i className="fa-solid fa-repeat fa-xl" style={{ color: "#8c8c8c" }} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default TypingTestStats;
