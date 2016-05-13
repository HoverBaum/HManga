import React from 'react';
import AppBar from 'material-ui/AppBar';
import Page from './page';

export default class Chapter extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			page: 1
		}
	}

	render() {
		let {chapter, mangaName} = this.props.params;
		let appBarTitle = `${mangaName} - ${chapter}`;
		return (
			<div>

			    <AppBar title={appBarTitle} />

				<Page page={this.state.page} />

			</div>
		)
	}
}
