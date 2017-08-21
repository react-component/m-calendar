import * as React from 'react';

export default class ShortcutPanel extends React.PureComponent<{}, {}> {
    render() {
        return (
            <div className="shortcut-panel">
                <div>今天</div>
                <div>昨天</div>
                <div>近一周</div>
                <div>近一个月</div>
            </div>
        );
    }
}