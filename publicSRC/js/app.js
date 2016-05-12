import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {amber500, amber700, grey600, fullWhite} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import HManga from './hmanga';

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: amber500,
    primary2Color: amber700,
    primary3Color: grey600,
    textColor: fullWhite,
    alternateTextColor: '#303030',
    canvasColor: '#303030',
    borderColor: fade(fullWhite, 0.3),
    disabledColor: fade(fullWhite, 0.3),
    pickerHeaderColor: fade(fullWhite, 0.12),
    clockCircleColor: fade(fullWhite, 0.12)
  }
});

const App = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <HManga />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
