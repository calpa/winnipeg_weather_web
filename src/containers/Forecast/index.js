import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, Select, MenuItem } from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import { DatePicker } from '@material-ui/pickers';
const Item = (props) => {
  const { period_string = '', cloudprecip = '', temperatures } = props;

  return (
    <Card
      style={{
        width: 150,
        margin: 10,
        padding: 10,
      }}
    >
      <Grid item xs={6} sm={12}>
        <p>{period_string}</p>
      </Grid>

      <Grid container item justifyContent='center'>
        {/* <img
          width={60}
          height={51}
          src='/weathericons/35.gif'
          alt='Clearing'
          className='center-block'
        /> */}
        <Typography paragraph variant='body2' style={{ width: '100%' }}>
          {temperatures}
        </Typography>

        <Typography paragraph>{cloudprecip}</Typography>
      </Grid>
    </Card>
  );
};
const Forecast = () => {
  const [loaded, setLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('All');
  const [weatherForecasts, setWeatherForecasts] = useState([]);
  const [times, setTimes] = useState([]);

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

  useEffect(() => {
    getWeatherForecasts({});
  }, []);

  useEffect(() => {
    getWeatherForecasts({
      date: selectedDate,
    });
  }, [selectedDate]);

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
      <Grid container item xs={12}>
        <Typography
          variant='h2'
          style={{
            marginLeft: 5,
          }}
        >
          {moment(selectedDate).format('DD/MM/YYYY')}
        </Typography>

        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          inputVariant='outlined'
          alignSelf='center'
          disableFuture
          style={{
            marginLeft: 20,
          }}
        />

        <Select
          value={selectedTime}
          onChange={(event) => setSelectedTime(event.target.value)}
          style={{
            marginLeft: 20,
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
            <Typography paragraph>Loading...</Typography>
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
              <Grid container item xs={12}>
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
                    <Item key={forecast._id} {...forecast} />
                  ))}
                </Grid>
              </Grid>
            ))}
      </Grid>
    </Grid>
  );
};
export default Forecast;
