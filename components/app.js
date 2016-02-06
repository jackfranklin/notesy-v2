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

  newActiveDocument(newDocument) {
    console.log('new doc called', newDocument);
    const newDocumentList = this.state.documents.map((doc) => {
      if (doc._id === newDocument._id) {
        return newDocument;
      } else {
        return doc;
      }
    });
    this.setState({
      activeDocument: newDocument,
      documents: newDocumentList
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      user: document.body.getAttribute('data-github-id'),
      activeDocument: undefined
    };
  }

  updateActiveDocumentById(newId) {
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
        this.updateActiveDocumentById(this.props.params.documentId);
      }
    } else if(this.props.params.documentId) {
        this.updateActiveDocumentById(this.props.params.documentId);
    }
  }

  componentWillMount() {
    getAll(this.state.user).then((data) => {
      this.setState({ documents: data.docs });
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
