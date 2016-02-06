import React from 'react';
import NoDocumentView from './no-document-view';
import Editor from 'react-md-editor';
import debounce from 'lodash/debounce';
import { updateNote } from '../db';

export default class DocumentView extends React.Component {
  static contextTypes = {
    newActiveDocument: React.PropTypes.func.isRequired
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

  renderDocument() {
    return (
      <Editor value={this.state.content} onChange={debounce(::this.updateContent, 1000)} />
    );
  }

  renderNoDocument() {
    return <NoDocumentView />;
  }

  render() {
    return this.props.document ? this.renderDocument() : this.renderNoDocument();
  }
}
