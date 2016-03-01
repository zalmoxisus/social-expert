import React, { Component, PropTypes } from 'react';
import MdSystemUpdate from 'react-icons/lib/md/system-update-alt';
import { Button } from 'react-toolbox/lib/button';
import { showVersion, checkUpdates } from '../../services/electron';
import Sortable from './sortable/Sortable';
import style from '../../style';

export default class Update extends Component {
  render() {
    return (
      <div className={style.page}>
        <h4><b>Social Expert</b> - Version: {showVersion()}</h4>
        <Button
          className={style.button} icon="system_update_alt" label="Update" raised primary
          onClick={checkUpdates}
        />
      </div>
    );
  }
}

export default Update;
