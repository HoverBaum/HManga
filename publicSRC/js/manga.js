import React from 'react';
import AppBar from 'material-ui/AppBar';
import Helper from './helper';
import DetailInfo from './detailInfo';

export default class Manga extends React.Component{

	constructor(props) {
        super(props);
		let {mangaName} = this.props.params;
        this.state = {
			manga: {
				name: ''
			}
		};
		var that = this;

		Helper.get('/API/manga/' + mangaName, function(data) {
			that.setState({
				manga: JSON.parse(data)
			});
		});

    }

	render() {
		return (
			<div>

			    <AppBar title={'HManga Reader - ' + this.state.manga.name} />

				<DetailInfo manga={this.state.manga} />

			</div>
		)
	}
}
