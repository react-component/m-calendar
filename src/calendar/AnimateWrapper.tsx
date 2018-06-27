import * as React from 'react';

export interface PropsType {
  visible: boolean;
  className?: string;
  displayType?: string;
}
export default class AnimateWrapper extends React.PureComponent<PropsType, {}> {
  static defaultProps = {
    className: '',
    displayType: 'flex',
  } as PropsType;

  render() {
    const { className, displayType, visible } = this.props;

    return <div
      className={className + ' animate'}
      style={{ display: visible ? displayType : 'none' }}>
      {visible && this.props.children}
    </div>;
  }
}
