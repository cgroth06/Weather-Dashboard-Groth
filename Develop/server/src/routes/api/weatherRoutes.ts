import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;
  if (!city) {
    try {
      const currentWeather = await WeatherService.getWeatherForCity(city);
      await HistoryService.addCity(city);
      res.json(currentWeather);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    res.send('Error in adding city to search history');
  }
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
    const cityId = req.params.id;
    if (!cityId) {
      res.status(400).json({ message: 'City ID is required' });
    }
    await HistoryService.removeCity(cityId);
    res.json({ success: 'City removed from search history' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export default router;
