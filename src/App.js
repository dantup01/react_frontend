import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props){
  super(props);
    this.state = {
      tileList:[],
      activeItem:{
        id:null,
        title:'',
        launch_date:'',
        status:'',
      },
      editing:false,
    }
    this.fetchTiles = this.fetchTiles.bind(this)
  };

  componentWillMount(){
    this.fetchTiles()
  }

  fetchTiles(){
    console.log('Fetching...')

    fetch('http://localhost:8000/api/tiles/')
    .then(response => response.json())
    .then(data =>
      this.setState({
        tileList:data,
      })
      )
  }

  handleChange()

  render(){
    var tiles = this.state.tileList
    return(
      <div className="container">
        <div id="tile-container">
          <div id="form-wrapper">
            <form id="form">
              <div className="flex-wrapper">

                <div style={{flex: 6}}>
                  <input className="form-control" id="tile-title" placeholder="Add a tile..."/>
                </div>

                <div style={{flex: 1}}>
                  <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                </div>

              </div>
            </form>
          </div>

          <div id="list-wrapper">
            {tiles.map(function(tile, index){
              return(
                <div key={index} className="tile-wrapper">

                  <span>{tile.title}</span>
                  <span>{tile.launch_date}</span>
                  <span>{tile.status}</span>

                  <div style={{flex:1}}>
                    <button className="btn btn-sm btn-outline-info">Edit </button>
                  </div>

                  <div style={{flex:1}}>
                    <button className="btn btn-sm btn-outline-danger">Delete </button>
                  </div>


                </div>

                )
            })}
          </div>
        </div>
      </div>
      )
  }
}

export default App;
