import React from 'react';
import { createNote, deleteNote } from '../db';

export default class Header extends React.Component {
  static propTypes = {
    userId: React.PropTypes.string.isRequired,
    activeDocument: React.PropTypes.object
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    updateDocumentList: React.PropTypes.func.isRequired
  };

  newNote() {
    createNote({
      content: '',
      userId: this.props.userId
    }).then((newNote) => {
      const { id } = newNote;
      this.context.router.push('/' + id);
      this.context.updateDocumentList();
    });
  }

  deleteNote() {
    deleteNote(this.props.activeDocument).then(() => {
      this.context.updateDocumentList();
      this.context.router.push('/');
    });
  }

  renderDeleteButton() {
    return (
      <button onClick={::this.deleteNote}>Delete Note</button>
    )
  }

  render() {
    return (
      <div>
        <button onClick={::this.newNote}>New Note</button>
        { this.props.activeDocument && this.renderDeleteButton() }
      </div>
    );
  }
}
