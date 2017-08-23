import * as React from 'react';

interface PropsType {
    locale: GlobalModels.Locale;
    onSelect: (startDate?: Date, endDate?: Date) => void;
}
export default class ShortcutPanel extends React.PureComponent<PropsType, {}> {

    onClick = (type: string) => {
        const { onSelect } = this.props;
        const today = new Date;

        switch (type) {
            case 'today':
                onSelect(
                    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0),
                    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12)
                );
                break;

            case 'yesterday':
                onSelect(
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0),
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 12)
                );
                break;

            case 'lastweek':
                onSelect(
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6, 0),
                    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12)
                );
                break;

            case 'lastmonth':
                onSelect(
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29, 0),
                    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12)
                );
                break;
        }
    }

    render() {
        const { locale } = this.props;

        return (
            <div className="shortcut-panel">
                <div className="item" onClick={() => this.onClick('today')}>{locale.today}</div>
                <div className="item" onClick={() => this.onClick('yesterday')}>{locale.yesterday}</div>
                <div className="item" onClick={() => this.onClick('lastweek')}>{locale.lastWeek}</div>
                <div className="item" onClick={() => this.onClick('lastmonth')}>{locale.lastMonth}</div>
            </div>
        );
    }
}