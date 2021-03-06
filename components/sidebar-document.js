import React from 'react';
import { Link } from 'react-router';
import dateFormat from 'dateformat';

export default class SidebarDocument extends React.Component {
  static contextTypes = {
    newActiveDocument: React.PropTypes.func.isRequired
  };

  render() {
    const { doc } = this.props;
    const updatedAt = parseInt(doc.updatedAt || doc._id, 10);
    const date = new Date(updatedAt);
    return (
      <Link className="sidebar-document-link" to={`/${doc._id}`}>
        <div>
          <span className="content">{ doc.content.substring(0, 100) }</span>
          <span className="date">{ dateFormat(date, "mmmm dS") }</span>
        </div>
      </Link>
    )
  }
}
