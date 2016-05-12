import React from 'react';

export default class DetailInfo extends React.Component{

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
