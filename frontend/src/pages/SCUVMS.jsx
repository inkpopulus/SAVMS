import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import CarInfo from "../components/CarInfo";
import HourlyForecastCard from "../components/HourlyForecastCard";
import SearchBar from "../components/SearchBar";
import CurrentWeatherCard from "../components/CurrentWeatherCard";
import Map from "../components/Map";

export default function SCUVMS() {
    const [carInfo, setCarInfo] = useState({});
    const [city, setCity] = useState('Canberra');
    const [currentWeather, setCurrentWeather] = useState({});
    const [weatherArray, setWeatherArray] = useState([]);
    const [coordinate, setCoordinate] = useState({lat: -35.2809, lng: 149.1300});
    const [markers, setMarkers] = useState([]);
    const [selectedCar, setSelectedCar] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            // TODO: axios get weather
            // const currentWeatherData = { weather: 'Sunny', temperature: 19, chanceOfRain: 30 };
            // const weatherArrayData = [
            //     { time: '1PM', weather: 'Sunny', temperature: 20 },
            //     { time: '2PM', weather: 'Cloudy', temperature: 18 },
            //     { time: '3PM', weather: 'Rainy', temperature: 16 },
            //     { time: '4PM', weather: 'Sunny', temperature: 17 },
            //     { time: '5PM', weather: 'Snowy', temperature: 19 },
            //     { time: '6PM', weather: 'Rainy', temperature: 21 },
            // ];
            // setCurrentWeather(currentWeatherData);
            // setWeatherArray(weatherArrayData);

            try {
                const res = await fetch(`http://localhost:8080/api/weather?city=${city}`);
                const result = await res.json();
                if (result.code === 1) {
                    const weatherInfo = JSON.parse(result.data);

                    const currentWeatherData = {
                        weather: weatherInfo.current.condition.code,
                        temperature: weatherInfo.current.temp_c,
                        chanceOfRain: weatherInfo.forecast.forecastday[0].day.daily_chance_of_rain,
                        description: weatherInfo.current.condition.text,
                    };
                    const currentLocalTime = weatherInfo.location.localtime; // "2025-03-17 23:50"
                    const currentHour = parseInt(currentLocalTime.split(' ')[1].split(':')[0]); // 23
                    const todayHours = weatherInfo.forecast.forecastday[0].hour.filter(hourItem => {
                        const itemHour = parseInt(hourItem.time.split(' ')[1].split(':')[0]);
                        return itemHour >= currentHour;
                    });
                    const tomorrowHours = weatherInfo.forecast.forecastday.length > 1
                        ? weatherInfo.forecast.forecastday[1].hour
                        : [];
                    const nextHours = [...todayHours, ...tomorrowHours];
                    const displayHours = nextHours.slice(0, 6);

                    const weatherArrayData = displayHours.map(hourItem => ({
                        time: hourItem.time.split(' ')[1], // 只取小时分钟
                        weather: hourItem.condition.code,
                        temperature: hourItem.temp_c,
                    }));


                    setCurrentWeather(currentWeatherData);
                    setWeatherArray(weatherArrayData);

                } else {
                    console.error('Backend Error:', result.msg);
                    alert(`Can't get weather Info: ${result.msg}`);
                }
            } catch (error) {
                console.error('Request error:', error);
                alert('Request error，Please try again！');
            }
        };
        fetchWeather();
    }, []);

    useEffect(() => {
        const fetchMarkers = async () => {
            // TODO: axios get markers
            const newMarkersData = [
                { lat: -35.2600, lng: 149.1300 },
                { lat: -35.2800, lng: 149.1500 },
                { lat: -35.3000, lng: 149.1600 },
            ];
            setMarkers(newMarkersData);
        };
        fetchMarkers();
    }, []);

    const handleSearch = (query) => {
        setCity(query);
        // TODO: get query cooredinate
        setCoordinate({lat: -35.2809, lng: 149.1300});
    };

    const handleMarkerClick = (marker) => {
        const fetchCarInfo = async () => {
            // TODO: axios get car info
            const carInfoData = { vehicleId: '#12345678', plateNum: 'XYZ-123' };
            setCarInfo(carInfoData);
        };
        fetchCarInfo();
        setSelectedCar(true);
    };

    return (
        <div className="bg-primary h-screen flex p-4 font-sans gap-4">
            <Sidebar />
            <div className="flex flex-col w-1/4 gap-4 flex-grow">
                <div className="text-2xl font-bold">Tracking</div>
                <div className="bg-accent rounded-3xl p-4 flex flex-col h-screen">
                    {selectedCar && <CarInfo carInfo={carInfo}/>}
                    {!selectedCar && <></>}
                </div>
            </div>
            
            {/* Weather and Map Section */}
            <div className="flex flex-col w-3/4 gap-4">
                <div className="h-1/3 flex gap-4">
                    <div className="w-4/5 flex flex-col gap-4">
                        <SearchBar onSearch={handleSearch} />
                        <div className="px-6 py-4 rounded-3xl flex flex-grow bg-radial-gradient text-white justify-between items-center">
                            {weatherArray.map((weather, index) => (
                                <HourlyForecastCard
                                    key={index} time={weather.time} weather={weather.weather} temperature={weather.temperature}
                                />
                            ))}
                        </div>
                    </div>
                    <CurrentWeatherCard city={city} currentWeather={currentWeather}/>
                </div>
                <div className="h-2/3 bg-white rounded-3xl">
                    <Map lat={coordinate.lat} lng={coordinate.lng} markers={markers} onMarkerClick={handleMarkerClick}/>
                </div>
            </div>
        </div>
    );
}
