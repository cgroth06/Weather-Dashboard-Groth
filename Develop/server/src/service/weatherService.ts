
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
  };
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
        const response = await fetch(
          `${this.baseURL}weather?q=${this.cityName}&apiKey=${this.apiKey}`
        );
        const locationData = await response.json();
        return locationData;
      } catch (error) {
        console.log(error);
        return error;
      }
    } 
    // TODO: Create destructureLocationData method
    private destructureLocationData(locationData: Coordinates): Coordinates {
      return { lon: locationData.lon,
         lat: locationData.lat };
    }
    // TODO: Create buildGeocodeQuery method
    private buildGeocodeQuery(): string {
      return `${this.baseURL}geocode?city=${this.cityName}&apiKey=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    private buildWeatherQuery(coordinates: Coordinates): string {
      return `${this.baseURL}weather?lat=${coordinates.lat}&lon=${coordinates.lon}&apiKey=${this.apiKey}`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    private fetchAndDestructureLocationData() {
      const locationData = await this.fetchLocationData();
      return this.destructureLocationData(locationData);
    }
    // TODO: Create fetchWeatherData method
    private fetchWeatherData(coordinates: Coordinates) {
      const query = await this.buildWeatherQuery(coordinates);
      const response = await fetch(query);
      return await response.json();
    }
    // TODO: Build parseCurrentWeather method
    private parseCurrentWeather(response: any) {
      return new Weather(response.temp, response.humidity, response.wind_speed);
    }
    // TODO: Complete buildForecastArray method
    private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
      return weatherData.map((data: any) => new Weather(data.temp, data.humidity, data.wind_speed));
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city: string) {
      
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastArray = this.buildForecastArray(currentWeather, weatherData);
      return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
