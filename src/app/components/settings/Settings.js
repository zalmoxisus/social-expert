import React, { Component, PropTypes } from 'react';
import { Tab, Tabs } from 'react-toolbox/lib/tabs';
import Sortable from './sortable/Sortable';
import Update from './Update';
import style from '../../style';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = { index: 0 };
  }

  handleTabChange = (index) => {
    this.setState({ index });
  };

  render() {
    return (
    <Tabs index={this.state.index} onChange={this.handleTabChange} className={style.settings}>
      <Tab label="&nbsp; Priority and weight &nbsp;" className={style.settingsTab}><Sortable/></Tab>
      <Tab label="&nbsp; Check for updates &nbsp;"><Update/></Tab>
    </Tabs>
    );
  }
}

export default Settings;
