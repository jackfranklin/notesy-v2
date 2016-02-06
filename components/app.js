import React from 'react';
import Sidebar from './sidebar';
import DocumentView from './document-view';
import {
  getAll,
  createNote,
  findNoteById
} from '../db';

export default class App extends React.Component {
  static childContextTypes = {
    newActiveDocument: React.PropTypes.func
  };

  getChildContext() {
    return {
      newActiveDocument: ::this.newActiveDocument
    }
  }

  newActiveDocument(document) {
    console.log('new active document called', document);
    this.setState({ activeDocument: document });
  }

  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      user: document.body.getAttribute('data-github-id'),
      activeDocument: undefined
    };
  }

  updateActiveDocument(newId) {
    console.log('need to update active document to', newId);
    findNoteById(newId).then((res) => {
      if (res.docs.length === 1) {
        this.newActiveDocument(res.docs[0]);
      } else {
        throw new Error('Update active document got 0 or >1 results!');
      }
    });
  }

  componentDidUpdate() {
    if (this.state.activeDocument) {
      if (this.state.activeDocument._id !== this.props.params.documentId) {
        this.updateActiveDocument(this.props.params.documentId);
      }
    } else if(this.props.params.documentId) {
        this.updateActiveDocument(this.props.params.documentId);
    }
  }

  componentWillMount() {
    getAll(this.state.user).then((data) => {
      this.setState({ documents: data.docs });
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
          <DocumentView document={this.state.activeDocument} />
        </div>
      </div>
    )
  }
}
