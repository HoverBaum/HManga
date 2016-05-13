/**
 *   Display of a single page.
 *   Takes care of the image and navigational things.
 *   Fires events when user navigates.
 */

import React from 'react';

export default class Page extends React.Component{

	constructor(props) {
		super(props);
		window.addEventListener('keydown', this.handleKeys);
	}

	handleKeys = (e) => {
		//39 right, 37 left, 27 ESC, 13 ENTER, 32 SPACE, 68 d, 65 a
		let code = e.keyCode;
		if(code === 39 || code === 68) {
			this.props.onNextPage();
		} else if(code === 37 || code === 65) {
			this.props.onPrevPage();
		}
	}

	render() {

		return (
			<div>

			    <img src={this.props.src} className="single-page" onClick={this.props.onNextPage} />

			</div>
		)
	}
}
