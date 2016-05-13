import React from 'react';
import AppBar from 'material-ui/AppBar';
import Page from './page';
import Helper from './helper';
import LinearProgress from 'material-ui/LinearProgress';

export default class Chapter extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			src: 'test.jpg',
			chapter: {}
		}
		let {chapter, mangaName} = this.props.params;
		this.getChapterInfo(mangaName, chapter);
		window.addEventListener('keydown', this.handleKeys);
	}

	getChapterInfo = (mangaName, chapterNumber) => {
		var that = this;
		Helper.get('/testManga.json', function(data) {
			data = JSON.parse(data);
			let returnChapter = data.chapters[chapterNumber];
			that.setState({chapter: returnChapter});
		});
	}

	nextPage = () => {

	}

	prevPage = () => {

	}

	render() {
		let {chapter, mangaName} = this.props.params;
		let appBarTitle = `${mangaName} - ${chapter}`;
		return (
			<div>

			    <AppBar title={appBarTitle} />
				<LinearProgress mode="determinate" value={this.state.page} max={this.state.chapter.totalPages} />

				<Page src={this.state.src} onNextPage={this.nextPage} onPrevPage={this.prevPage} />

			</div>
		)
	}
}
