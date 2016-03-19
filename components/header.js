import React from 'react';
import AddIcon from 'react-icons/lib/ti/document-add';
import DeleteIcon from 'react-icons/lib/ti/delete-outline';
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
      content: 'Make Shakespeare jelly.',
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
      <a href='#' onClick={::this.deleteNote} className='svg-icon'><DeleteIcon /></a>
    )
  }

  render() {
    return (
      <div>
        <a href='#' onClick={::this.newNote} className='svg-icon'><AddIcon /></a>
        { this.props.activeDocument && this.renderDeleteButton() }
      </div>
    );
  }
}
