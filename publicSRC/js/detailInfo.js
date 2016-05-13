import React from 'react';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';

var router = null;

export default class DetailInfo extends React.Component{

	constructor(props, context) {
    	super(props);
		router = context.router;
    	this.state = {
      		snackbarOpen: false,
    	};
  	}

	calculateOffline = (manga) => {
		let offline = 0;
		if(!manga.chapters) return 0;
		manga.chapters.forEach(chapter => {
			if(chapter.finished) {
				offline += 1;
			}
		});
		return offline;
	}

	makeGenreString = (manga) => {
		if(!manga.genres) {
			return '';
		}
		let genres = '';
		manga.genres.forEach(genre => {
			genres += genre + ', ';
		});
		return genres.substring(0, genres.length - 2);
	}

	generateChapterList = (manga) => {
		if(!manga.chapters) {
			return '';
		}
		let rows = manga.chapters.map(chapter => {
			let elementStyle = {
				opacity: (chapter.finished) ? '1' : '0.7'
			}
			function clickHandler() {
				router.push(`/manga/${manga.name}/${chapter.chapter}`);
			}
			return (
				<ListItem primaryText={`Chapter ${chapter.chapter}`} disabled={!chapter.finished} style={elementStyle} onTouchTap={clickHandler} />
			)
		});
		return rows;
	}

	seachForUpdates = () => {
		this.setState({
			snackbarOpen: true
		});
	}

	handleRequestClose = () => {
    	this.setState({
      		snackbarOpen: false,
    	});
  	};

	render() {
		return (
			<MuiThemeProvider muiTheme={getMuiTheme()}>
			<div>
				<Card className="detail-card">
	    			<CardTitle title={this.props.manga.name} subtitle={this.makeGenreString(this.props.manga)} />
	    			<CardText>
	      				{this.props.manga.description}
						<Divider />
						<List>
							<Subheader>Publication status</Subheader>
					      	<ListItem primaryText={'Last chapter: ' + this.props.manga.lastChapterReleased}  />
					      	<ListItem primaryText={'Chapters available: ' + this.props.manga.totalChapters} />
					      	<ListItem primaryText={'Offline available: ' + this.calculateOffline(this.props.manga)}  />
					      	<ListItem primaryText={(this.props.manga.ongoing) ? 'ongoing' : 'finsihed'}  />
					    </List>
	    			</CardText>
	    			<CardActions>
	      				<FlatButton label="Search for updates" onClick={this.seachForUpdates} />
	    			</CardActions>
	  			</Card>
				<Card className="detail-card">
					<CardTitle title="Chapters" subtitle="Including not yet downloaded" />
					<CardText>
						<List>
							{this.generateChapterList(this.props.manga)}
						</List>
					</CardText>
				</Card>
				<Snackbar
		          	open={this.state.snackbarOpen}
		          	message="This feature is coming soon, use the commandline for now."
		          	autoHideDuration={4000}
					onRequestClose={this.handleRequestClose}
		        />
			</div>
			</MuiThemeProvider>
		)
	}
}

DetailInfo.contextTypes = {
    router: React.PropTypes.func.isRequired
};
