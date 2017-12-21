import * as React from 'react';
import { Models } from './DataTypes';

export interface PropsType {
  locale: Models.Locale;
}

export default class WeekPanel extends React.PureComponent<PropsType, {}> {
  constructor(props: PropsType) {
    super(props);
  }

  render() {
    const { locale } = this.props;
    const { week } = locale;
    return (
      <div className="week-panel">
        <div className="cell cell-grey">{week[0]}</div>
        <div className="cell">{week[1]}</div>
        <div className="cell">{week[2]}</div>
        <div className="cell">{week[3]}</div>
        <div className="cell">{week[4]}</div>
        <div className="cell">{week[5]}</div>
        <div className="cell cell-grey">{week[6]}</div>
      </div>
    );
  }
}
