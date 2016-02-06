import React from 'react';
import NoDocumentView from './no-document-view';
import Editor from 'react-md-editor';

export default class DocumentView extends React.Component {
  static contextTypes = {
    newActiveDocument: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    console.log('got props', props);
    this.state = {
      content: props.document && props.document.content
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({ content: newProps.document && newProps.document.content });
  }

  updateContent(newContent) {
    console.log('got new content', newContent);
  }

  renderDocument() {
    return (
      <Editor value={this.state.content} onChange={::this.updateContent} />
    );
  }

  renderNoDocument() {
    return <NoDocumentView />;
  }

  render() {
    return this.props.document ? this.renderDocument() : this.renderNoDocument();
  }
}
