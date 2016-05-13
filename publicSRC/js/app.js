import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {amber500, amber700, grey600, fullWhite} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

const muiTheme = getMuiTheme({
	fontFamily: 'Roboto, sans-serif',
  	palette: {
    	primary1Color: amber500,
    	primary2Color: amber700,
    	primary3Color: grey600,
    	alternateTextColor: '#45443f',
    	canvasColor: '#45443f',
    	borderColor: fade(fullWhite, 0.3),
    	disabledColor: fade(fullWhite, 0.3),
    	pickerHeaderColor: fade(fullWhite, 0.12),
    	clockCircleColor: fade(fullWhite, 0.12)
  	}
});

import Home from './home';
import Manga from './manga';
import Chapter from './chapter';
import { Router, Route, hashHistory } from 'react-router';

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();


const App = () => (
	<MuiThemeProvider muiTheme={muiTheme}>
	<Router history={hashHistory}>
	    <Route path="/" component={Home}/>
		<Route path="/manga/:mangaName" component={Manga} />
		<Route path="/manga/:mangaName/:chapter" component={Chapter} />
	</Router>
	</MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
