import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (_req, _res) => {

  // TODO: GET weather data from city name
  //HERE!
  router.get('/weather/:city', async (req: Request, res: Response) => {
    try {
      const cityName = req.params.city;
      const currentWeather = await WeatherService.getWeatherForCity(cityName);
      await HistoryService.addCity(cityName);
      res.json(currentWeather);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
    // TODO: save city to search history
    router.post('/api/weather', async (req: Request, res: Response) => {
      const { city } = req.body;
      if (req.body.city) {
        await HistoryService.addCity(city);
        res.json({ success: 'City added to search history' });
      } else {
        res.send('Error in adding city to search history');
      }
    });
  });
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const searchHistory = await HistoryService.getCities();
    res.json(searchHistory);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: 'City ID is required' });
    }
    await HistoryService.removeCity(req.params.id);
    res.json({ success: 'City removed from search history' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export default router;
