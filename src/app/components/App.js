import React, { Component, PropTypes } from 'react';
import Navigation from './Navigation';
import style from '../style';

export default class App extends Component {
  render() {
    return (
      <div className={style.container}>
        <Navigation location={this.props.location}/>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};
