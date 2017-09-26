import * as React from 'react';
import { Models } from '../date/DataTypes';

export interface PropsType {
  title?: string;
  locale?: Models.Locale;
  showClear?: boolean;
  onCancel?: () => void;
  onClear?: () => void;
  closeIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;
}

export default class Header extends React.PureComponent<PropsType, {}> {
  static defaultProps = {
    closeIcon: 'X',
  };

  render() {
    const {
      title,
      locale = {} as Models.Locale,
      onCancel,
      onClear,
      showClear,
      closeIcon,
      clearIcon,
    } = this.props;

    return (
      <div className="header">
        <span className="left" onClick={() => onCancel && onCancel()}>{closeIcon}</span>
        <span className="title">{title || locale.title}</span>
        {
          showClear &&
          <span className="right"
            onClick={() => onClear && onClear()}
          >{clearIcon || locale.clear}</span>
        }
      </div>
    );
  }
}
