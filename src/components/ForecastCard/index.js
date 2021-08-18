import React from 'react';
import { Grid, Typography, Card } from '@material-ui/core';
import WbCloudyIcon from '@material-ui/icons/WbCloudy';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import GrainIcon from '@material-ui/icons/Grain';

const ForecastCard = (props) => {
  const { period_string = '', cloudprecip = '', temperatures } = props;

  let icon = <React.Fragment />;

  const testSentence = cloudprecip.toLowerCase();
  if (testSentence.includes('cloudy')) {
    icon = <WbCloudyIcon />;
  } else if (testSentence.includes('sunny') || testSentence.includes('clear')) {
    icon = <WbSunnyIcon />;
  } else if (testSentence.includes('rain')) {
    icon = <GrainIcon />;
  } else if (cloudprecip === 'A mix of sun and cloud.') {
    icon = <WbCloudyIcon />;
  }

  return (
    <Card
      style={{
        width: 150,
        margin: 10,
        padding: 10,
      }}
    >
      <Grid item xs>
        <Typography paragraph variant='subtitle1'>
          {period_string}
        </Typography>
      </Grid>

      <Grid container item>
        {icon}
        <Typography
          paragraph
          variant='body2'
          style={{
            marginLeft: 10,
          }}
        >
          {temperatures}
        </Typography>

        <Typography
          paragraph
          align='left'
          style={{
            width: '100%',
          }}
        >
          {cloudprecip}
        </Typography>
      </Grid>
    </Card>
  );
};

export default ForecastCard;
