import * as React from 'react';
import { Models } from '../date/DataTypes';

export default class Header extends React.PureComponent<{
  title?: string;
  locale?: Models.Locale;
  showClear?: boolean;
  onCancel?: () => void;
  onClear?: () => void;
}, {}> {

  render() {
    const {
            title,
      locale = {} as Models.Locale,
      onCancel,
      onClear,
      showClear
        } = this.props;

    return (
      <div className="header">
        <span className="left" onClick={() => onCancel && onCancel()}>X</span>
        <span className="title">{title || locale.title}</span>
        {
          showClear &&
          <span className="right"
            onClick={() => onClear && onClear()}
          >{locale.clear}</span>
        }
      </div>
    );
  }
}
