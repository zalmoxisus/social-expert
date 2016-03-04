import React, { Component, PropTypes } from 'react';
import { toastr } from 'react-redux-toastr'
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
    this.handleSelect = this.handleSelect.bind(this);
  }

  getOrderType() {
    switch (this.props.order) {
      case 1: return 'priority and time';
      case 2: return 'priority and weight';
      default: return 'time';
    }
  }

  mapRef(node) {
    this.menu = node;
  }

  showMenu() {
    this.menu.show();
  }

  confirm() {
    if (!this.props.restricted) return true;
    toastr.confirm('You didn\'t set priorities. Let\'s do it now?', {
      onOk: () => { this.context.router.push('/settings/targets'); }
    });
    return false;
  }

  handleTabChange(idx) {
    if (this.confirm()) this.props.changeSection({ host: 'github', section: idx });
  }

  handleSelect(value) {
    if (this.confirm()) this.props.changeOrder({ host: 'github', order: value });
  }

  render() {
    const { order, section } = this.props;
    return (
      <div className={style.toolBar}>
        <Tabs index={section} onChange={this.handleTabChange} className={style.tabs}>
          <Tab label="All"/>
          <Tab label="Critical"/>
          <Tab label="Medium priority"/>
          <Tab label="Low priority"/>
        </Tabs>
        <div className={style.menu}>
          <div className={style.menuLabel} onClick={this.showMenu}>
            <span className={style.menuTitle}>Ordered by {this.getOrderType()}</span>
            <FontIcon value="more_vert" className={style.menuIcon} />
          </div>
          <Menu
            position="top-right" selectable menuRipple
            selected={order}
            onSelect={this.handleSelect}
            ref={this.mapRef}
          >
            <MenuItem value={0} icon="access_time" caption="Order by time" />
            <MenuItem value={1} icon="priority_high" caption="Order by priority and time" />
            <MenuItem value={2} icon="line_weight" caption="Order by priority and weight" />
          </Menu>
        </div>
      </div>
    );
  }
}

Toolbar.contextTypes = {
  router: PropTypes.object.isRequired
};

Toolbar.propTypes = {
  order: PropTypes.number,
  section: PropTypes.number,
  changeSection: PropTypes.func.isRequired,
  changeOrder: PropTypes.func.isRequired,
  restricted: PropTypes.bool
};
