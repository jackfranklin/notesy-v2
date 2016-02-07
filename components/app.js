import React from 'react';
import Sidebar from './sidebar';
import DocumentView from './document-view';
import Header from './header';
import {
  getAll,
  createNote,
  findNoteById
} from '../db';

export default class App extends React.Component {
  static childContextTypes = {
    newActiveDocument: React.PropTypes.func,
    updateDocumentList: React.PropTypes.func
  };

  getChildContext() {
    return {
      newActiveDocument: ::this.newActiveDocument,
      updateDocumentList: ::this.updateDocumentList
    }
  }

  updateDocumentList() {
    getAll(this.state.user).then((data) => {
      // TODO: can I do the reverse query as a Pouch _id sort?
      this.setState({ documents: data.docs.reverse() });
    });
  }

  newActiveDocument(newDocument) {
    if (!newDocument) {
      this.setState({ activeDocument: undefined });
      return;
    }

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

  componentDidUpdate(prevProps) {
    const oldDocId = prevProps.params && prevProps.params.documentId;
    const newDocId = this.props.params && this.props.params.documentId;

    if (oldDocId === newDocId) return;
    console.log('cDU called', oldDocId, newDocId);

    if (oldDocId && newDocId && oldDocId !== newDocId) {
      // went from one note to another, need to fetch new one
      console.log('from', oldDocId, 'to', newDocId);
      this.updateActiveDocumentById(newDocId);
    } else if (!oldDocId && newDocId) {
      console.log('from home page to doc');
      this.updateActiveDocumentById(newDocId);
      // went from no doc to a new one
    } else if(oldDocId && !newDocId) {
      // went from a doc to the home page (usually deleted)
      console.log('from doc to home page');
      this.newActiveDocument(undefined);
    }
  }

  componentWillMount() {
    this.updateDocumentList();
  }

  render() {
    return (
      <div>
        <div className="header">
          <Header userId={this.state.user} />
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
