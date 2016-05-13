import React from 'react';
import AppBar from 'material-ui/AppBar';
import Helper from './helper';
import DetailInfo from './detailInfo';

export default class Manga extends React.Component{

	constructor(props) {
        super(props);
        this.state = {
			manga: {}
		};
		var that = this;
		Helper.get('/testManga.json', function(data) {
			that.setState({
				manga: JSON.parse(data)
			});
		});

    }

	render() {
		let appBarTitle = 'HManga Reader - ';
		return (
			<div>

			    <AppBar title={appBarTitle} />

				<DetailInfo manga={this.state.manga} />

			</div>
		)
	}
}
