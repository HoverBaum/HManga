import React from 'react';
import AppBar from 'material-ui/AppBar';
import Page from './page';
import Helper from './helper';
import LinearProgress from 'material-ui/LinearProgress';

var router = null;

export default class Chapter extends React.Component{

	constructor(props, context) {
		super(props);
		router = context.router;
		this.state = {
			page: 1,
			pages: [],
			chapter: {}
		}
		document.scrollTop = 0;
		let {chapter, mangaName} = this.props.params;
		this.getChapterInfo(mangaName, chapter);
		window.addEventListener('keydown', this.handleKeys);
	}

	preloadNextPage = (number) => {
		if(number > this.state.chapter.totalPages) return;
		let pages = this.state.chapter.pages;
		let page;
		pages.forEach(p => {
			if(p.page === number) {
				page = p;
			}
		});
		var that = this;
		Helper.get(`/API/page/${encodeURIComponent(page.file)}.jpg`, function(data) {
			let pages = that.state.pages;
			pages[number] = 'data:image/jpg;base64,' + data;
			that.setState({pages: pages});
			that.preloadNextPage(number + 1);
		});
	}

	getChapterInfo = (mangaName, chapterNumber) => {
		var that = this;
		Helper.get(`/API/manga/${mangaName}/${chapterNumber}`, function(data) {
			data = JSON.parse(data);
			that.setState({chapter: data});
			that.preloadNextPage(1);
		});
	}

	nextPage = () => {
		if(!this.state.chapter.totalPages) return;
		let page = this.state.page;
		page += 1;
		if(page > this.state.chapter.totalPages) {
			this.nextChapter();
		} else {
			this.setState({page: page});
		}
	}

	nextChapter = () => {
		let {chapter, mangaName} = this.props.params;
		window.location.hash = `#/manga/${mangaName}/${this.state.chapter.chapter + 1}`;
		window.location.reload();
	}

	prevPage = () => {
		let page = this.state.page;
		if(page > 1) {
			page -= 1;
			this.setState({page: page});
		}
	}

	render() {
		let {chapter, mangaName} = this.props.params;
		let appBarTitle = `${mangaName} - ${chapter}`;
		window.scrollTo(0,0);
		return (
			<div>

			    <AppBar title={appBarTitle} />
				<LinearProgress mode="determinate" value={this.state.page} max={this.state.chapter.totalPages} />

				<Page src={this.state.pages[this.state.page]} onNextPage={this.nextPage} onPrevPage={this.prevPage} />

			</div>
		)
	}
}
