import * as React from 'react';

interface PropsType {
    onSelect: (startDate?: Date, endDate?: Date) => void;
}
export default class ShortcutPanel extends React.PureComponent<PropsType, {}> {

    onClick = (type: string) => {
        const { onSelect } = this.props;
        const today = new Date;

        switch (type) {
            case 'today':
                onSelect(
                    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
                    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0)
                );
                break;

            case 'yesterday':
                onSelect(
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0),
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 12, 0, 0)
                );
                break;

            case 'lastweek':
                onSelect(
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6, 0, 0, 0),
                    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0)
                );
                break;

            case 'lastmonth':
                onSelect(
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30, 0, 0, 0),
                    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0)
                );
                break;
        }
    }

    render() {
        return (
            <div className="shortcut-panel">
                <div className="item" onClick={() => this.onClick('today')}>今天</div>
                <div className="item" onClick={() => this.onClick('yesterday')}>昨天</div>
                <div className="item" onClick={() => this.onClick('lastweek')}>近一周</div>
                <div className="item" onClick={() => this.onClick('lastmonth')}>近一个月</div>
            </div>
        );
    }
}