class Link extends React.Component {
  constructor(props) {
      super(props);
      this.setData=this.setData.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleMonthChange = this.handleMonthChange.bind(this);
      this.handleYearChange = this.handleYearChange.bind(this);
      this.handleArticleClick = this.handleArticleClick.bind(this);
      this.state = {
          allArticles: {},
          year: '1951',
          month: '1',
          pageSize: 15,
          selectedArticle: {}
      };
  }

  setData(data) {
      const links = data.response.docs;
      this.setState(() => ({ allArticles: links }));
  }
  
  handleMonthChange(e) {
      const month = e.target.value;
      console.log(month);
      this.setState(() => ({ month: month }));
  }
  
  handleYearChange(e) {
      const year = e.target.value;
      console.log(year);
      this.setState(() => ({ year: year }));
  }
  handleSubmit(e) {
      e.preventDefault();
      const year = this.state.year;
      const month = this.state.month;

      console.log(year, month);
      var url = `https://api.nytimes.com/svc/archive/v1/${year}/${month}.json`;
      url += '?' + $.param({
      'api-key': "51e7864a4e7c4a2b990dd8e41f131457"
      });

      $.ajax({
          url: url,
          method: 'GET',
          success: this.setData,
          error: this.setError
      });
  }

  handleArticleClick(selectedArticle) {
  	console.log("HandleArticleClick!");
      this.setState(() => ({ selectedArticle: selectedArticle }));
  }

  render() {
    let selectedArticles;
    const currentYear = new Date().getFullYear();
    if( !!Object.keys(this.state.allArticles).length ) {
      selectedArticles = this.state.allArticles.slice(0, this.state.pageSize);
    }

    const jsx = (
      <div id="page">
        <header id="header">
          <h1>NYT Explorer</h1>
        </header>
        <div>
          <p>The New York Times Archive provides lists of NYT articles by month going back to 1851. Simply pass in the year and month you want and Explorer will return all articles for that month.</p>
          <form onSubmit={this.handleSubmit}>
            <input
              id="month" 
              type="number" 
              min="1" 
              max="12" 
              placeholder="Month" 
              onChange={this.handleMonthChange} 
              value={this.state.month} 
            /> 
            <input 
              id="year" 
              type="number" 
              min="1851" 
              max={currentYear}  
              placeholder="Year" 
              onChange={this.handleYearChange} 
              value={this.state.year}
            />
            <input type="submit" value="Search" />
          </form>
        </div>
        <main id="articleContainer">
          {
            !!Object.keys(this.state.allArticles).length && 
            <div>
              <Preview
                selectedArticles={selectedArticles}
                handleArticleClick={this.handleArticleClick}
              />
              <ArticleDetails selectedArticle={this.state.selectedArticle}/> 
            </div>
          }
        </main>
        <footer id ="footer">
          <p>Data provided by <img src="img/poweredby_nytimes_65a.png" alt="NYT API"/></p>
          <p>Links preview by Link Preview API</p>
          <p>Designed by Bojana Milosevic 2018</p>
        </footer>
      </div>
    );
    
    return jsx;
  }
}

class Preview extends React.Component {
  render(){
    const links=this.props.selectedArticles;
    return (
      <div id="gallery">
          {
            links.map( (article) => {
                return <Article handleArticleClick={this.props.handleArticleClick} link={article} key={article._id} url={article.web_url} />;
            } )
          }
      </div>
    );
  }
}

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.setData = this.setData.bind(this);
    this.handleArticleClick = this.handleArticleClick.bind(this);
    this.state = {
        details: {}
    };
  }

  componentDidMount() {
  	console.log('componentDidMount');
    const key = '5a8c62dd15c2c14a495f407b8ad447785894dd86df624';
  //  const url = `https://api.linkpreview.net/?key=${key}&q=${this.props.url}`;
    const url = `https://api.linkpreview.net/?key=123456&q=https://www.google.com`
  
    $.ajax({
        url: url,
        method: 'GET',
        success: this.setData,
        error: this.setError
    });
  }

  handleArticleClick() {
    // console.log(this.props.link);
    const selectedArticle = this.props.link;
    this.props.handleArticleClick(selectedArticle);
  }

  setData(data) {
    const details = data;
    this.setState(() => ({ details: details }));
  }
  render(){
    const link = this.props.link;
    
    return(
        <div className="single-article" onClick={this.handleArticleClick}>
          <div>
            <img src={this.state.details.image} alt="PIP"/>
            <h4>{this.state.details.title}</h4>
            <p>{this.state.details.description}</p>
          </div>
        </div>
      
    );
  }
} 


class ArticleDetails extends React.Component {
  render() {
    const thisArticle = this.props.selectedArticle;
    console.log(thisArticle.headline);
    return (
        <div id="details" className="visible" >
            <h3>Details</h3>
            {
              !!Object.keys(thisArticle).length &&
              <div>
              <h3>Title:{thisArticle.headline.main}</h3>
              <p>Read more:<a href={thisArticle.web_url} target="_blank">{thisArticle.web_url}</a></p>
              <p>Word Count:{thisArticle.word_count}</p>
              <p>Published: {thisArticle.pub_date}</p>
              </div>
            }
        </div>
    );
  }
} 

ReactDOM.render(<Link />, document.getElementById('root'));
