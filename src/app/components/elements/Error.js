import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';
import style from '../../style';

export default () => (
  <div className={style.errored}>
    <h3>Oops. Something went wrong.</h3>
    <h2>Please try again later.</h2>
    <FontIcon value="error_outline" className={style.iconBig} />
  </div>
);
