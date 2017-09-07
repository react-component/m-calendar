import * as React from 'react';

export default class WeekPanel extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className="week-panel">
        <div className="cell cell-grey">日</div>
        <div className="cell">一</div>
        <div className="cell">二</div>
        <div className="cell">三</div>
        <div className="cell">四</div>
        <div className="cell">五</div>
        <div className="cell cell-grey">六</div>
      </div>
    );
  }
}
