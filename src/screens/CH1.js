import React, { Component } from 'react';
import './App.css';
import AddItem from './AddItem';
import SingleItem from './singleItem';

class CH1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      isLoaded: false,
    }
    this.onAdd = this.onAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentWillMount() {
    const dataSource = this.getDataSource();

    this.setState({dataSource});
  }

getDataSource() {
  return fetch('https://beer.fluentcloud.com/v1/beer')
    .then(response => response.json())
    .then(responseJson => {
      this.setState({
        isLoaded: true,
        dataSource: responseJson,
      });
    })
    .catch(error => console.log(error)); //to catch the errors if any
}

onAdd( name, likes) {
  const dataSource = this.getDataSource();

  dataSource.push({
    name,
    likes
  });
  this.setState({dataSource});
}

onDelete(name) {
  const dataSource = this.dataSource();

  const filteredDataSource = dataSource.filter(dataSource => {
    return dataSource.name !== name;

  });
  this.setState({ dataSource: filteredDataSource});
}

  render() {
    var {isLoaded, dataSource} = this.state;
    return (
      <div className="App">
      <h1>What's in My Fridge?</h1>

      <AddItem
        onAdd={this.onAdd}
      />

          {
            this.state.dataSource.map(dataSource => {
              return (
                <SingleItem
                  key={dataSource.name}
                  name={dataSource.name}
                  likes={dataSource.likes}
                  onDelete={this.onDelete}
                />
              );
            })
          }




      </div>
    );
  }
}

export default App;
