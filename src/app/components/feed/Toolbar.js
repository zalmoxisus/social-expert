import React, { Component, PropTypes } from 'react';
import { Tab, Tabs } from 'react-toolbox/lib/tabs';
import { Menu, MenuItem } from 'react-toolbox/lib/menu';
import FontIcon from 'react-toolbox/lib/font_icon';
import style from './style';

export default class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.mapRef = this.mapRef.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  mapRef(node) {
    this.menu = node;
  }

  showMenu() {
    this.menu.show();
  }

  handleTabChange() {
    
  }

  render() {
    return (
      <div className={style.toolBar}>
        <Tabs index={0} onChange={this.handleTabChange} className={style.tabs} >
          <Tab label="All"/>
          <Tab label="Critical"/>
          <Tab label="Medium priority"/>
          <Tab label="Low priority"/>
        </Tabs>
        <div className={style.menu}>
          <div className={style.menuLabel} onClick={this.showMenu}>
            <span>Ordered by time</span>
            <FontIcon value="more_vert" className={style.menuIcon} />
          </div>
          <Menu position="top-right" selectable menuRipple ref={this.mapRef}>
            <MenuItem value="time" icon="access_time" caption="Order by time" />
            <MenuItem value="priority" icon="priority_high" caption="Order by priority" />
            <MenuItem value="weight" icon="line_weight" caption="Order by priority and weight" />
          </Menu>
        </div>
      </div>
    );
  }
}
