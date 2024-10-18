
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lon: number;
  lat: number;
};

// TODO: Define a class for the Weather object
class Weather {
  temp: number;
  humidity: number;
  windSpeed: number;

  constructor(temp: number, humidity: number, windSpeed: number) {
    this.temp = temp;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
};

// TODO: Complete the WeatherService class
// TODO: Define the baseURL, API key, and city name properties
class WeatherService {
  private baseURL?: string = '';
  private apiKey?: string = '';
  private cityName?: string = '';

  constructor() {
    this.baseURL = process.env.API_BASE_URL || ``;
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const locationData = await response.json();
      return locationData ;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lon: locationData.lon,
      lat: locationData.lat
    };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}geocode?city=${this.cityName}&apiKey=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    let query = `${this.baseURL}weather?lat=${coordinates.lat}&lon=${coordinates.lon}&apiKey=${this.apiKey}`;
    console.log('query:' + query);
    return query;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
   let locationDataDes = await this.destructureLocationData(await this.fetchLocationData(this.buildGeocodeQuery()));
   console.log('locationDataDes:' + locationDataDes);
   return locationDataDes;
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const query = this.buildWeatherQuery(coordinates);
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather data', error);
      throw error;
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const temp = response.current.temp;
    const humidity = response.current.humidity;
    const wind_speed = response.current.wind_speed;
    

    return new Weather(temp, humidity, wind_speed);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecast = [currentWeather];
    const forecastData = weatherData.map((data: any) => new Weather(data.temp, data.humidity, data.wind_speed));
    return forecast.concat(forecastData);
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData);
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
