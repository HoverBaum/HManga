import React from 'react';
import AppBar from 'material-ui/AppBar';
import Helper from './helper';

var mangaInfo = {};
Helper.get('/testManga.json', function(data) {
	mangaInfo = JSON.parse(data);
	console.log('change ' + mangaInfo.name);
});

export default class Home extends React.Component{

	//NEXT hier weiter. das holen im constructor und dann ein untermodul.

	render() {
		let {mangaName} = this.props.params;
		let appBarTitle = 'HManga Reader - ' + mangaName;
		return (
			<div>

			    <AppBar title={appBarTitle} />

				<DetailInfo manga={this.state.manga} />

			</div>
		)
	}
}
