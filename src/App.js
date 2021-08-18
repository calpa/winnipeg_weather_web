import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import './App.css';
import MomentUtils from '@date-io/moment';

import Forecast from './containers/Forecast';

// TODO: use react-router to route the pages

function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <div
        className='App'
        style={{
          background: '#f5f5f5',
          width: '100%',
          padding: 10,
          // height: '100vh',
        }}
      >
        <Forecast />
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default App;
