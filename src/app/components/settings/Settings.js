import React, { Component, PropTypes } from 'react';
import { Tab, Tabs } from 'react-toolbox/lib/tabs';
import style from '../../style';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = { index: 0 };
    this.tabs = [
      ['targets', 'Priority and weight'],
      ['update', 'Check for updates']
    ];
  }

  handleTabChange = (index) => {
    this.setState({ index });
    this.context.router.push('/settings/' + this.tabs[index][0]);
  };

  render() {
    return (
      <div className={style.settings}>
        <Tabs index={this.state.index} onChange={this.handleTabChange} className={style.tabs} >
          {this.tabs.map(tab => (
            <Tab label={tab[1]} key={tab[0]}/>
          ))}
        </Tabs>
        <div className={style.scontainer}>{this.props.children}</div>
      </div>
    );
  }
}

Settings.contextTypes = {
  router: PropTypes.object.isRequired
};

Settings.propTypes = {
  children: PropTypes.any.isRequired
};


export default Settings;
