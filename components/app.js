import React from 'react';
import Sidebar from './sidebar';
import { db, getAll, createNote } from '../db';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      user: document.body.getAttribute('data-github-id')
    };
  }

  componentWillMount() {
    getAll(this.state.user).then((data) => {
      this.setState({ documents: data.rows });
      console.log('got data', data);
    });
  }

  render() {
    return (
      <div>
        <div className="header">
          <p>Welcome to Notesy V2</p>
        </div>
        <div className="sidebar">
          <Sidebar documents={this.state.documents} />
        </div>
        <div className="main">
          <p>Hello World</p>
        </div>
      </div>
    )
  }
}
