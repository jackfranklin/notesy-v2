import React from 'react';
import { createNote } from '../db';

export default class Header extends React.Component {
  static propTypes = {
    userId: React.PropTypes.string.isRequired
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

  render() {
    return (
      <div>
        <button onClick={::this.newNote}>New Note</button>
      </div>
    );
  }
}
