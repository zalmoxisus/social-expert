import React, { Component, PropTypes } from 'react';
import MdSystemUpdate from 'react-icons/lib/md/system-update-alt';
import { showVersion, checkUpdates } from '../services/electron';

export default class Settings extends Component {
  render() {
    return (
      <div className="container-fluid main-container settings">
        <div className="row">
          <div className="col-xs-offset-1 col-xs-10">
            <button className="btn btn-default btn-lg btn-block" onClick={checkUpdates}>
              <MdSystemUpdate/> Update
            </button>
          </div>
        </div>
        <div className="row footer">
          <div className="col-xs-12 text-right">
            <b>Social Expert</b> - Version: {showVersion()}
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
