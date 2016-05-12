import React from 'react';
import {Link} from 'react-router';
import {List, ListItem} from 'material-ui/List';

var mangas = [
	{
		name: 'The Gamer'
	},
	{
		name: 'Tales of Demons and Gods'
	}
]

export default class MangaList extends React.Component{

	createMangaDisplay(mangas) {
		var rows = mangas.map(manga => {
			let toLink = `/manga/${manga.name}`;
            return (
				<ListItem primaryText={<Link to={toLink}>{manga.name}</Link>} />
			)
        });
        return rows;
	}

	render() {
		let mangaRows = mangas.map
		return (
			<div>
			
				<List className="mangaList">
					{this.createMangaDisplay(mangas)}
		    	</List>


			</div>
		)
	}
}
