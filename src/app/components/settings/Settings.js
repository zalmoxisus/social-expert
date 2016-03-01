import React, { Component, PropTypes } from 'react';
import Sortable from './sortable/Sortable';
import style from '../../style';

export default class Settings extends Component {
  render() {
    return (
      <div className={style.settings}>
        <Sortable/>
      </div>
    );
  }
}

export default Settings;
