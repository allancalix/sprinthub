// @flow
import React from 'react';
import styles from './css/CheckListPanel.css';

type Props = {
  checklists: Object
};

const CheckListPanel = ({ checklists }: Props) => (
  <div className={styles.rightPanel}>
    <h1>{checklists.name}</h1>
    <ul>
      {checklists.checklists.map(checklist =>
        (<li key={checklist.id}>
          <h3>{checklist.name}</h3>
          <ul>
            {checklist.checkItems.map(criteria =>
              <li key={criteria.id}>{criteria.name}</li>
            )}
          </ul>
        </li>)
      )}
    </ul>
  </div>
);

export default CheckListPanel;
