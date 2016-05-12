import React from 'react';
import AppBar from 'material-ui/AppBar';

export default class Home extends React.Component{
	render() {
		let {mangaName} = this.props.params;
		let appBarTitle = 'HManga Reader - ' + mangaName;
		return (
			<div>

			    <AppBar title={appBarTitle} />
				{mangaName}
			</div>
		)
	}
}
