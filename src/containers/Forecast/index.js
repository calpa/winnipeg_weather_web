import React, { useEffect, useState, useCallback } from 'react';
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
} from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import { DatePicker } from '@material-ui/pickers';

import ForecastCard from '../../components/ForecastCard';

const Forecast = () => {
  const [loaded, setLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('All');
  const [weatherForecasts, setWeatherForecasts] = useState([]);
  const [times, setTimes] = useState([]);

  const [availableDates, setAvailableDates] = useState([]);

  async function getWeatherForecasts({ date = '2021-08-17' }) {
    try {
      setLoaded(false);
      setWeatherForecasts([]);
      setTimes([]);
      setSelectedDate(date);
      setSelectedTime('All');
      const url = 'https://pdgzqf.deta.dev/weather/';
      const { data } = await axios.get(url, {
        params: {
          query_date: moment(date).format('YYYY-MM-DD'),
        },
      });
      if (data && data.data) {
        const result = {};
        data.data.forEach((forecast) => {
          const { date_time_local } = forecast;
          forecast.date_time_local = moment(date_time_local);
          if (
            result[date_time_local] &&
            Array.isArray(result[date_time_local])
          ) {
            result[date_time_local].push(forecast);
          } else {
            result[date_time_local] = [forecast];
          }
        });
        const times = Object.keys(result).sort((a, b) => moment(a).diff(b));

        setWeatherForecasts(result);
        setTimes(times);
        setLoaded(true);
      }
    } catch (err) {
      console.error(err);
      setLoaded(true);
      //   throw new Error(err);
    }
  }

  const getAvailableDates = useCallback(async () => {
    try {
      const url = 'https://pdgzqf.deta.dev/weather/available_days';
      const { data } = await axios.get(url);

      const availableDates = data.data
        .map((item) => item._id)
        .sort((a, b) => moment(a).diff(b));
      setAvailableDates(availableDates);
      getWeatherForecasts({
        date: availableDates[availableDates.length - 1],
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getWeatherForecasts({
      date: selectedDate,
    });
  }, [selectedDate]);

  useEffect(() => {
    getAvailableDates();
  }, [getAvailableDates]);

  return (
    <Grid
      container
      direction='column'
      style={{
        minHeight: '100vh',
        maxWidth: '80vw',
        margin: '0 auto',
      }}
    >
      <Grid
        container
        item
        xs={12}
        style={{
          background: '#ffffff',
          borderRadius: 10,
          padding: 10,
        }}
      >
        <Typography
          component='h1'
          variant='h3'
          style={{
            marginLeft: 5,
            marginBottom: 10,
            width: '100%',
          }}
        >
          Winnipeg Weather Forecast
          {selectedDate && ` -  ${moment(selectedDate).format('DD/MM/YYYY')}`}
        </Typography>

        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          inputVariant='outlined'
          disableFuture
          style={{
            marginLeft: 20,
          }}
          renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
            const disabled = !availableDates.includes(day.format('YYYY-MM-DD'));

            return React.cloneElement(dayComponent, { disabled });
          }}
        />

        <Select
          value={selectedTime}
          onChange={(event) => setSelectedTime(event.target.value)}
          style={{
            marginLeft: 20,
            alignSelf: 'center',
          }}
        >
          <MenuItem value='All'>All</MenuItem>
          {times.map((time) => (
            <MenuItem value={time} key={time}>
              {moment(time).format('HH:mm')}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid container item xs={12} spacing={2}>
        {loaded && Object.keys(weatherForecasts).length === 0 && (
          <Grid container item xs={12} justifyContent='center'>
            <Typography paragraph>No Available Weather Forecast</Typography>
          </Grid>
        )}
        {!loaded && (
          <Grid container item xs={12} justifyContent='center'>
            <CircularProgress />
          </Grid>
        )}

        {times &&
          times
            .filter((time) => {
              if (selectedTime === 'All') {
                return true;
              }
              return (
                moment(time).format('HH:mm') ===
                moment(selectedTime).format('HH:mm')
              );
            })
            .map((time) => (
              <Grid container item xs={12} key={time}>
                <Typography
                  variant='h3'
                  style={{
                    marginLeft: 10,
                  }}
                >
                  {moment(time).format('HH:mm')}
                </Typography>
                <Grid container>
                  {(weatherForecasts[time] || []).map((forecast) => (
                    <ForecastCard key={forecast._id} {...forecast} />
                  ))}
                </Grid>
              </Grid>
            ))}
      </Grid>
    </Grid>
  );
};
export default Forecast;
