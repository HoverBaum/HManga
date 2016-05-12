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
		Helper.get('/testManga.json', function(data) {
			this.setState({
				manga: JSON.parse(data)
			});
		});

    }

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
