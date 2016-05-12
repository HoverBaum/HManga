import React from 'react';
import AppBar from 'material-ui/AppBar';
import MangaList from './mangaList';


const Home = () => (

	<div>
    	<AppBar title="HManga Reader" />
		<MangaList />
	</div>

);

export default Home;
