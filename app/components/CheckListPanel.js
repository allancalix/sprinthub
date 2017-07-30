// @flow
import React, { PropTypes } from 'react';
import styles from './CheckListPanel.css';

const CheckListPanel = ({ checklists }) => {
  return (
    <div className={styles.rightPanel}>
      <h1>{checklists.name}</h1>
      <ul>
        {checklists.checklists.map(checklist => 
          <li key={checklist.id}>
            <h3>{checklist.name}</h3>
            <ul>
              {checklist.checkItems.map(criteria => 
                <li key={criteria.id}>{criteria.name}</li>
              )}
            </ul>
          </li>
        ) }  
      </ul>
    </div>
  );
}

CheckListPanel.propTypes = {
  checklists: PropTypes.object.isRequired,
}

export default CheckListPanel;