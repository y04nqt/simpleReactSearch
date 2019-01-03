import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
    super(props);
    this.state = {
          error: null,
          isLoaded: false,
          quotesPerPage: 15,
          currentPage: 1,
          pageCount: null,
          quotes: [],
          searchItems: []
      };
      this.choosePage = this.choosePage.bind(this);
      this.incrementPage = this.incrementPage.bind(this);
      this.decrementPage = this.decrementPage.bind(this);
      this.filterList = this.filterList.bind(this);
    }

    filterList(event) {
        var updatedItems = this.state.quotes;
        updatedItems = updatedItems.filter(function(item){
            console.log(item.source, item.context, item.quote, item.theme);
            if(item.context.toLowerCase().search(event.target.value.toLowerCase()) !== -1){
                return item;
            }
            if(item.source.toLowerCase().search(event.target.value.toLowerCase()) !== -1){
                return item;
            }
            if(item.theme.toLowerCase().search(event.target.value.toLowerCase()) !== -1){
                return item;
            }
            if(item.quote.toLowerCase().search(event.target.value.toLowerCase()) !== -1){
                return item;
            }
        });
        this.setState({searchItems: updatedItems});
        console.log(this.state.searchItems);
    }

    choosePage(event) {
        // remove the other highlights
        document.getElementById(event.target.id).className += ' highlighted';
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    incrementPage() {
        if(this.state.currentPage < this.state.pageCount){
            this.setState({
                currentPage: this.state.currentPage+=1
            })
        }
    }

    decrementPage() {
        if(this.state.currentPage > 1){
            this.setState({
                currentPage: this.state.currentPage-=1
            })
        }
    }
      
    componentDidMount() {
        fetch('https://gist.githubusercontent.com/benchprep/dffc3bffa9704626aa8832a3b4de5b27/raw/b191cf3b6ea9cdcca8b363516ff969261398061f/quotes.json')
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        isLoaded: true,
                        quotes: result,
                        pageCount: Math.round(result.length / this.state.quotesPerPage),
                        searchItems: result
                    });
                    console.log(Math.round(this.state.quotes.length / 15));
                    console.log(result);
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                    console.log(error);
                }
            )
    }
  render() {
    const indexOfLastQuote = this.state.currentPage * this.state.quotesPerPage;
    const indexOfFirstQuote = indexOfLastQuote - this.state.quotesPerPage;
    const currentQuotes = this.state.searchItems.slice(indexOfFirstQuote, indexOfLastQuote);

    const renderQuotes = currentQuotes.map((searchItems, index) => {
          return <li key={index}>{searchItems.quote}</li>;
        });

    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(this.state.searchItems.length / this.state.quotesPerPage); i++) {
        pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
        return (
                <li key={number} className='numbers' id={number} onClick={this.choosePage}>
                  {number}
                </li>
            );
    });

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Lister</h1>
        </header>
        <p className="App-intro">
            Quotes
        </p>
        <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filterList}/>
        <ol className="pages-count-container">
            <li onClick={this.decrementPage} >Previous</li>
            {renderPageNumbers}
            <li onClick={this.incrementPage} >Next</li>
        </ol>
        <ul>
            {renderQuotes}
        </ul>
      </div>
    );
  }
}

export default App;
