import React from 'react';
import NoDocumentView from './no-document-view';
import Editor from 'react-md-editor';
import debounce from 'lodash/debounce';
import { updateNote, idFromDate } from '../db';

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
    if (doc.content === newContent) return;
    let newDoc = {
      _id: doc._id,
      _rev: doc._rev,
      userId: doc.userId,
      content: newContent,
      updatedAt: idFromDate()
    }
    updateNote(newDoc).then((updatedDoc) => {
      newDoc._rev = updatedDoc.rev;
      this.context.newActiveDocument(newDoc);
    });
  }

  renderDocument() {
    const codemirrorOptions = {
      lineWrapping: true,
      autofocus: true
    };

    return (
      <div className="document-view">
        <Editor
          value={this.state.content}
          options={codemirrorOptions}
          onChange={debounce(::this.updateContent, 500)} />
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
