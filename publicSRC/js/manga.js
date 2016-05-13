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
		let {mangaName} = this.props.params;
		Helper.get('/API/' + mangaName, function(data) {
			that.setState({
				manga: data
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
