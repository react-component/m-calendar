import * as React from 'react';

export interface ConfirmPanelPropsType {
    type?: 'one' | 'range';
    locale: Models.Locale;
    onlyConfirm?: boolean;
    disableBtn?: boolean;
    startDateTime?: Date;
    endDateTime?: Date;
    formatStr?: string;
    onConfirm: () => void;
}
export default class ConfirmPanel extends React.PureComponent<ConfirmPanelPropsType, {}> {
    static defaultProps = {
        formatStr: 'yyyy-MM-dd hh:mm'
    } as ConfirmPanelPropsType;

    formatDate(date: Date, format: string) {
        const week = this.props.locale.week;

        let o: { [key: string]: any } = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'w+': week[date.getDay()],
            'S': date.getMilliseconds(),
        };
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
            }
        }
        return format;
    }

    onConfirm = () => {
        const { onConfirm, disableBtn } = this.props;
        !disableBtn && onConfirm();
    }

    render() {
        const { type, locale, formatStr = '', disableBtn } = this.props;
        let { startDateTime, endDateTime } = this.props;
        if (startDateTime && endDateTime && +startDateTime > +endDateTime) {
            const tmp = startDateTime;
            startDateTime = endDateTime;
            endDateTime = tmp;
        }

        const startTimeStr = startDateTime ? this.formatDate(startDateTime, formatStr) : locale.noChoose;
        const endTimeStr = endDateTime ? this.formatDate(endDateTime, formatStr) : locale.noChoose;
        let btnCls = disableBtn ? 'button button-disable' : 'button';
        if (type === 'one') {
            btnCls += ' button-full';
        }

        return (
            <div className="confirm-panel">
                {
                    type === 'range' &&
                    <div className="info">
                        <p>开始：<span className={!startDateTime ? 'grey' : ''}>{startTimeStr}</span></p>
                        <p>结束：<span className={!endDateTime ? 'grey' : ''}>{endTimeStr}</span></p>
                    </div>
                }
                <div className={btnCls} onClick={this.onConfirm}>
                    确定
                </div>
            </div>
        );
    }
}