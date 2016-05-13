import React from 'react';
import {Link} from 'react-router';
import {List, ListItem} from 'material-ui/List';
import Helper from './helper';

export default class MangaList extends React.Component{

	constructor(props) {
        super(props);
        this.state = {
			mangas: []
		};
		var that = this;
		Helper.get('/API/allMangas', function(data) {
			that.setState({
				mangas: JSON.parse(data)
			});
		});

    }

	createMangaDisplay(mangas) {
		var rows = mangas.map(manga => {
			let toLink = `/manga/${manga.urlName}`;
            return (
				<ListItem onClick={this.handleSelect} primaryText={<Link to={toLink}>{manga.name}</Link>} />
			)
        });
        return rows;
	}

	handleSelect = (e) => {
		e.target.children[0].click();
	}

	render() {
		return (
			<div>

				<List className="mangaList">
					{this.createMangaDisplay(this.state.mangas)}
		    	</List>

			</div>
		)
	}
}
