import React, { Component, PropTypes } from 'react';
import Navigation from '../components/Navigation';

export default class App extends Component {
  render() {
    return (
      <div>
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
