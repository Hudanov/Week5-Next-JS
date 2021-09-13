import React from 'react';
import Image from 'next/image';
import { NextPage } from 'next/types';
import { useAuth } from '../lib/useAuth';
import Router from 'next/router';

interface WeatherData {
  readonly main: { temp: number };
  readonly name: string;
  readonly weather: [{ icon: string, description: string }];
  readonly sys: {
    readonly country: string;
    readonly sunrise: number;
    readonly sunset: number;
  };
  readonly cod: number;
}

interface CityNotFound {
  readonly state: boolean;
  readonly message: string;
}

const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const Forecast: NextPage = () => {
  const API_KEY = "c647ab49b15757dbe184259fff6fe4c5";
  const auth = useAuth();
  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);
  const [cityNotFound, setCityNotFound] = React.useState<CityNotFound | null>(null);

  const searchField = React.useRef<HTMLInputElement>(null);
  const temperatureText = React.useRef<HTMLParagraphElement>(null);
  const sunriseTime = React.useRef<HTMLParagraphElement>(null);
  const sunsetTime = React.useRef<HTMLParagraphElement>(null);
  const locationText = React.useRef<HTMLParagraphElement>(null);
  const weatherIcon = React.useRef<HTMLDivElement>(null);
  const descriptionText = React.useRef<HTMLParagraphElement>(null);
  const failureMessage = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      Router.push('/login');
    }

    loadData();
  }, []);

  React.useEffect(() => {
    if (!weatherData) return;

    if (temperatureText.current) temperatureText.current.innerText = Math.round(weatherData.main.temp).toString();
    if (sunriseTime.current) sunriseTime.current.innerText = getFormattedTime(weatherData.sys.sunrise);
    if (sunsetTime.current) sunsetTime.current.innerText = getFormattedTime(weatherData.sys.sunset);
    if (locationText.current) locationText.current.innerText = `${weatherData.name}, ${weatherData.sys.country}`;
    if (weatherIcon.current) {
      (weatherIcon.current.firstChild as HTMLImageElement).src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    }
    if (descriptionText.current) descriptionText.current.innerText = capitalizeFirstLetter(weatherData.weather[0].description);
  }, [weatherData]);

  React.useEffect(() => {
    if (cityNotFound && failureMessage.current) {
      if (cityNotFound.state === true) failureMessage.current.innerText = capitalizeFirstLetter(cityNotFound.message);
      else failureMessage.current.innerText = "";
    }
  }, [cityNotFound])

  async function loadData() {
    const cityName = searchField.current?.value ? searchField.current.value : 'Kyiv';

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`);
    const data = await response.json();

    console.log(data);

    if (data.cod !== 200) {
      setCityNotFound({ state: true, message: data?.message });
      return;
    }

    setCityNotFound({ state: false, message: '' });
    setWeatherData(data);
  }

  function getFormattedTime(time: number): string {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    const date = new Date(time * 1000);

    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();

    // Will display time in hh:mm:ss format
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;
  }

  return (
    <div className="bg-green-700 w-full h-screen flex flex-col items-center justify-center">

      <div className="mb-5">
        <img src={"/cloud-search-outline.svg"} alt="" onClick={loadData} className="relative top-11 left-4 rounded-3xl hover:bg-white p-1" />
        <input type="text" placeholder="Kyiv" ref={searchField} onSubmit={loadData}
          className="text-center bg-white p-4 bg-opacity-70 rounded-3xl flex space-x-12 items-center shadow-md focus:outline-none focus:bg-white focus:border-purple-500"
        />
        {cityNotFound?.state &&
          <div className="text-center pt-5 lg:px-4">
            <div className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none rounded-full flex lg:inline-flex" role="alert">
              <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">Error</span>
              <span ref={failureMessage} className="font-semibold mr-2 text-left flex-auto" />
            </div>
          </div>
        }
      </div>
      <button onClick={loadData} id="Update" className="rounded-full text-center bg-red-900 text-white w-40 my-7 py-4 font-bold">
            Select city
            </button>

      <div className="bg-white bg-opacity-70 p-8 rounded-3xl flex space-x-12 items-center shadow-md">
        <div>
          <div ref={weatherIcon}>
            <img src={""} alt="weather icon" className="h-32 w-32" />
          </div>
          <p ref={descriptionText} className="text-center text-gray-500 mt-2 text-sm">Cloudy</p>
        </div>

        <div>
          <p className="text-7xl font-bold text-right text-gray-900"><span ref={temperatureText} />&#176;C</p>
          <div className="flex flex-row">
            <div className="w-8 h-8 mr-2">
              <Image src={"/weather-sunset-up.svg"} height={32} width={32} alt='sunset' />
            </div>
            <p ref={sunriseTime} className="text-gray-900 mt-2 text-sm" />
          </div>
          <div className="flex flex-row">
            <div className="w-8 h-8 mr-2">
              <Image src={"/weather-sunset-down.svg"} height={32} width={32} alt='sunset' />
            </div>
            <p ref={sunsetTime} className="text-gray-900 mt-2 text-sm" />
          </div>
          <p ref={locationText} className="text-gray-500 text-sm" />
        </div>
      </div>
    </div >
  );
}

export default Forecast;
