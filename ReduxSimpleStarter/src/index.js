import _ from 'lodash';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import SearchBar from './component/search_bar';
import VideoList from './component/video_list';
import VideoDetail from './component/video_detail';
import YTSearch from 'youtube-api-search';
const API_KEY = 'AIzaSyB8YBmY5W74MeGdbOmYpO5w_Q-vCBaMieQ';



// Create a new component - will produce HTML
// => ES6 function declaration
class App extends Component  {
    constructor(props) {
        super(props);

        this.state = {
            videos: [],
            selectedVideo: null
        };

        this.videoSearch('ESP guitars');
    }

    videoSearch(term) {
        YTSearch({key: API_KEY, term: term}, (data) => {
            //console.log(data)
            this.setState({
                videos: data,
                selectedVideo: data[0]
            });
        });
    }

    render() {
        const videoSearch = _.debounce((term) => {this.videoSearch(term)}, 300)
        return (
            <div>
                <SearchBar onSearchTermChange={videoSearch} />
                <VideoDetail video={this.state.selectedVideo} />
                <VideoList videos={this.state.videos} onVideoSelect={selectedVideo => this.setState({selectedVideo}) } />
            </div>
        );
    }
}


// Instruct React to put this HTML on the page/dom
ReactDom.render(<App />, document.querySelector('.container'));

