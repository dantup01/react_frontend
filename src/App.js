import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props){
  super(props);
    this.state = {
      tileList:[],
      taskList:[],
      activeTile:{
        id:null,
        title:'',
        launch_date:'',
        status:'',
      },
      activeTask:{
        id:null,
        title:'',
        order_field:'',
        description:'',
        type:'',
        tile:'',
      },
      editing:false,
    }
    this.fetchTiles = this.fetchTiles.bind(this)
    this.fetchTasks = this.fetchTasks.bind(this)

    this.handleTileChange = this.handleTileChange.bind(this)
    this.handleTaskChange = this.handleTaskChange.bind(this)

    this.handleTileSubmit = this.handleTileSubmit.bind(this)
    this.handleTaskSubmit = this.handleTaskSubmit.bind(this)

    this.getCookie = this.getCookie.bind(this)

    this.startTileEdit = this.startTileEdit.bind(this)
    this.startTaskEdit = this.startTaskEdit.bind(this)

    this.deleteTile = this.deleteTile.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
  };

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }


  componentWillMount(){
    this.fetchTiles()
    this.fetchTasks()
  }

  fetchTiles(){
    console.log('Fetching tiles...')

    fetch('http://localhost:8000/tiles/')
    .then(response => response.json())
    .then(data =>
      this.setState({
        tileList:data,
      })
      )
  }

  fetchTasks(){
    console.log('Fetching tasks...')

    fetch('http://localhost:8000/api/tasks')
    .then(response => response.json())
    .then(data =>
      this.setState({
        taskList:data,
      })
      )
  }

  handleTileChange(event){
    var name = event.target.name
    var value = event.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeTile:{
        ...this.state.activeTile,
        [name]:value,
      }
    })
  }

  handleTaskChange(event){
    var name = event.target.name
    var value = event.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeTask:{
        ...this.state.activeTask,
        [name]:value,
      }
    })
  }

  handleTileSubmit(event){
    event.preventDefault()
    console.log('ITEM:', this.state.activeTile)

    var url = 'http://localhost:8000/tiles/tile/create/'

    var csrftoken = this.getCookie('csrftoken')

    if(this.state.editing === true){
      url = `http://localhost:8000/tiles/tile/edit/${ this.state.activeTile.id }/`
      this.setState({
        editing:false
      })
    }

    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify(this.state.activeTile)
    }).then((response) => {
      this.fetchTiles()
      this.setState({
        activeTile:{
          id:null,
          title:'',
          launch_date:'',
          status:'',
        }
      })
    }).catch(function(error){
      console.log('ERROR:', error)
    })
  }

  handleTaskSubmit(event){
    event.preventDefault()
    console.log('ITEM:', this.state.activeTask)

    var url = 'http://localhost:8000/api/tasks/task-create/'

    var csrftoken = this.getCookie('csrftoken')

    if(this.state.editing === true){
      url = `http://localhost:8000/tiles/tile/${ this.state.activeTask.tile }/edit/${ this.state.activeTask.id }/`
      this.setState({
        editing:false
      })
    }

    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify(this.state.activeTask)
    }).then((response) => {
      this.fetchTasks()
      this.setState({
        activeTask:{
          id:null,
          title:'',
          order_field:'',
          description:'',
          type:'',
          tile:'',
        },
      })
    }).catch(function(error){
      console.log('ERROR:', error)
    })
  }

  startTileEdit(tile){
    this.setState({
      activeTile:tile,
      editing:true,
    })
  }

  startTaskEdit(task){
    this.setState({
      activeTask:task,
      editing:true,
    })
  }

  deleteTile(tile){
    var csrftoken = this.getCookie('csrftoken')

    fetch(`http://localhost:8000/tiles/tile/delete/${tile.id}/`, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
    }).then((response) =>{
      this.fetchTiles()
    })
  }

  deleteTask(task){
    var csrftoken = this.getCookie('csrftoken')

    fetch(`http://localhost:8000/tiles/tile/${task.tile}/delete/${task.id}/`, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
    }).then((response) =>{
      this.fetchTasks()
    })
  }

  tileDropdown(){
    let dropdown = document.getElementById('tile-dropdown');
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose Tile';

    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

    const url = 'http://localhost:8000/tiles/';

    fetch(url)
      .then(
        function(response) {
          if (response.status !== 200) {
            console.warn('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

      // Examine the text in the response
      response.json().then(function(data) {
        let option;

        for (let i = 0; i < data.length; i++) {
          option = document.createElement('option');
          option.text = data[i].title;
          option.value = data[i].title;
          dropdown.add(option);
      }
      });
    }
  )
  .catch(function(err) {
    console.error('Fetch Error -', err);
  });
  }


  render(){
    var tiles = this.state.tileList
    var tasks = this.state.taskList
    var self = this
    return(
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleTileSubmit} id="task-form">
              <div className="flex-wrapper">

                <div style={{flex: 6}}>
                  <h3>Create a Tile</h3>
                  <label htmlFor="title">Add a title for your tile:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    onChange={this.handleTileChange}
                    value={this.state.activeTile.title}
                    placeholder="Add a tile..."
                  />
                  <label htmlFor="launch_date">Launch Date:</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="launch_date"
                    onChange={this.handleTileChange}
                    value={this.state.activeTile.launch_date}
                  />
                  <p>Status:</p>
                  <select name="status" onChange={this.handleTileChange} value={this.state.activeTile.status}>
                    <option value="LIV">Live</option>
                    <option value="PEN">Pending</option>
                    <option value="ARC">Archived</option>
                  </select>
                </div>

                <div style={{flex: 1}}>
                  <input id="tile-submit" className="btn btn-warning" type="submit" name="Add" />
                </div>

              </div>
            </form>
          </div>

            <div id="task-container">
              <div id="form-wrapper">
                <form onSubmit={this.handleTaskSubmit} id="task-form">
                  <div className="flex-wrapper">

                    <div style={{flex: 6}}>
                      <h3>Add a Task</h3>
                      <label htmlFor="title">Add a title for your task:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        onChange={this.handleTaskChange}
                        value={this.state.activeTask.title}
                        placeholder="Add a title for your task..."
                      />
                      <br></br>
                      <label htmlFor="order_field">Order Field:</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        className="form-control"
                        name="order_field"
                        onChange={this.handleTaskChange}
                        value={this.state.activeTask.order_field}
                      />
                      <br></br>
                      <label htmlFor="description">Description:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="description"
                        onChange={this.handleTaskChange}
                        value={this.state.activeTask.description}
                        placeholder="Add a description..."
                      />
                      <br></br>
                      <p>Type:</p>
                      <select name="type" onChange={this.handleTaskChange} value={this.state.activeTask.type}>
                        <option value="SUR">Survey</option>
                        <option value="DIS">Discussion</option>
                        <option value="DIA">Diary</option>
                      </select>
                      <br></br>
                      <p>Add to Tile:</p>
                      <select id="tile-dropdown" name="tile" onClick={() => this.tileDropdown()} onChange={this.handleTaskChange} value={this.state.activeTask.tile}>

                      </select>
                    </div>

                    <div style={{flex: 1}}>
                      <input id="task-submit" className="btn btn-warning" type="submit" name="Add" />
                    </div>

                  </div>
                </form>
              </div>


          <div className="cards">
            {tiles.map(function(tile, index){
              return(
                <div key={index} className="card-tile">

                  <div className="card-tile-infos">
                    <div>
                      <h2>{tile.title}</h2>
                      <p>{tile.launch_date}</p>
                    </div>
                    <h2 className="card-trip-pricing">{tile.status}</h2>


                  <div style={{flex:1}}>
                    <button onClick={() => self.startTileEdit(tile)} className="btn btn-sm btn-outline-info">Edit </button>
                  </div>

                  <div style={{flex:1}}>
                    <button onClick={() => self.deleteTile(tile)} className="btn btn-sm btn-outline-danger delete">Delete </button>
                  </div>

                  </div>
                </div>
                )
            })}
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default App;
