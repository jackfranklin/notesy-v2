import React from 'react';

import SidebarDocument from './sidebar-document';

export default class Sidebar extends React.Component {
  // TODO: feel like we could do this in am more efficient manner
  // or at least try to avoid doing this as much as possible
  sortByDate() {
    return this.props.documents.sort((a, b) => {
      const aDate = new Date(parseInt(a.updatedAt || a._id, 10));
      const bDate = new Date(parseInt(b.updatedAt || b._id, 10));

      return bDate - aDate;
    });
  }

  renderDocuments() {
    return this.sortByDate().map((doc) => {
      return (
        <li key={doc._id} className="sidebar-document">
          <SidebarDocument doc={doc} />
        </li>
      );
    });
  }

  render() {
    return (
      <ul className="sidebar-list">
        { this.renderDocuments() }
      </ul>
    );
  }
}
