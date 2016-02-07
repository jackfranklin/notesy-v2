import React from 'react';
import NoDocumentView from './no-document-view';
import Editor from 'react-md-editor';
import debounce from 'lodash/debounce';
import { updateNote, deleteNote } from '../db';

export default class DocumentView extends React.Component {
  static contextTypes = {
    newActiveDocument: React.PropTypes.func.isRequired,
    updateDocumentList: React.PropTypes.func.isRequired,
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      content: props.document && props.document.content
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({ content: newProps.document && newProps.document.content });
  }

  updateContent(newContent) {
    const doc = this.props.document;
    if (!doc) return;
    let newDoc = {
      _id: doc._id,
      _rev: doc._rev,
      userId: doc.userId,
      content: newContent
    }
    updateNote(newDoc).then((updatedDoc) => {
      newDoc._rev = updatedDoc.rev;
      this.context.newActiveDocument(newDoc);
    });
  }

  deleteSelf() {
    deleteNote(this.props.document).then(() => {
      this.context.updateDocumentList();
      this.context.router.push('/');
    });
  }

  renderDocument() {
    return (
      <div className="document-view">
        <div className="toolbar">
          <button onClick={::this.deleteSelf}>Delete</button>
        </div>
        <Editor value={this.state.content} onChange={debounce(::this.updateContent, 1000)} />
      </div>
    );
  }

  renderNoDocument() {
    return <NoDocumentView />;
  }

  render() {
    return this.props.document ? this.renderDocument() : this.renderNoDocument();
  }
}
