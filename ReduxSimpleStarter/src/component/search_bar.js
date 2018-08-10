import React, { Component } from 'react';

class SearchBar extends Component { //gives search bar all functionality from React component
    constructor(props){ //constructor function called by default when SearchBar initiates
        super(props); //super calls parent method

        this.state = { term: 'Enter your search'}; //create new state object - term is value updated in search bar
    }

    render () {
        return (
            <div className="search-bar">
                <input
                    value={this.state.term} //Controlled component: meaning it gets its value from the state - this.state.term (state is its parent)
                    onChange={event => this.onInputChange((event.target.value))}
                    onFocus={event => this.onInputFocus((event.target.value))}
                />
                    Value of the input (in this.state): {this.state.term}
            </div>
        );
    }

    onInputChange(term) {
        this.setState({term});
        this.props.onSearchTermChange(term);
    }

    onInputFocus(term) {
        this.setState({term: ''});

        //this.setState({term});
    }

}

export default SearchBar;