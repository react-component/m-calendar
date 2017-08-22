/* tslint:disable:no-console */

import 'rmc-picker/assets/index.css';
import 'rmc-date-picker/assets/index.css';
import 'rmc-calendar/assets/index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Calendar, { PropsType, ExtraData } from '../src/Calendar';

import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';
const en = location.search.indexOf('en') !== -1;

const extra: { [key: string]: ExtraData } = {
    1501516800000: { info: '建军节' },
    '2017/08/14': { info: '培训', disable: true },
    '2017/08/15': { info: '培训', disable: true },
    '2017/08/16': { info: '培训', disable: true },
    '2017/08/17': { info: '培训', disable: true },
    '2017/08/18': { info: '培训', disable: true },
};
for (let key in extra) {
    if (extra.hasOwnProperty(key)) {
        let info = extra[key];
        const date = new Date(key);
        if (!Number.isNaN(+date) && !extra[+date]) {
            extra[+date] = info;
        }
    }
}

class BasicDemo extends React.Component<{}, {
    show: boolean;
    config?: PropsType;
    startTime?: Date;
    endTime?: Date;
}> {
    originbodyScrollY = document.getElementsByTagName('body')[0].style.overflowY;

    constructor(props: any) {
        super(props);
        this.state = {
            show: false,
            config: {},
        };
    }

    renderBtn(text: string, text2: string, config: PropsType = {}) {
        return <div style={{ background: '#1A7BE6', padding: 5, margin: 10, textAlign: 'center' }}
            onClick={() => {
                document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
                this.setState({
                    show: true,
                    config,
                });
            }}>
            <p style={{ color: '#fff', margin: 0, padding: 0 }}>{text}</p>
            <p style={{ color: '#fff', margin: 0, padding: 0 }}>{text2}</p>
        </div>;
    }

    render() {
        return (
            <div style={{ marginTop: 10, marginBottom: 10, fontSize: 14 }}>
                {this.renderBtn('选择日期区间', 'Select Date Range')}
                {this.renderBtn('选择日期时间区间', 'Select DateTime Range', { pickTime: true })}
                {this.renderBtn('选择日期', 'Select Date', { type: 'one' })}
                {this.renderBtn('选择日期时间', 'Select DateTime', { type: 'one', pickTime: true })}
                {this.renderBtn('选择日期区间(快捷)', 'Select Date Range (Shortcut)', { showShortcut: true })}
                {this.renderBtn('选择日期时间区间(快捷)', 'Select DateTime Range (Shortcut)', { pickTime: true, showShortcut: true })}
                {this.renderBtn('不使用ZScroll(无法向前滚动)', '', { infinite: false })}
                {this.renderBtn('水平进入', '', { enterDirection: 'horizontal' })}
                <div style={{ marginLeft: 10, fontSize: 14 }}>
                    {
                        this.state.startTime &&
                        <p>开始时间：{this.state.startTime.toLocaleString()}</p>
                    }
                    {
                        this.state.endTime &&
                        <p>结束时间：{this.state.endTime.toLocaleString()}</p>
                    }
                </div>
                <Calendar
                    locale={en ? enUS : zhCN}
                    {...this.state.config}
                    visible={this.state.show}
                    onCancel={() => {
                        document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
                        this.setState({
                            show: false,
                            startTime: undefined,
                            endTime: undefined,
                        });
                    }}
                    onConfirm={(startTime, endTime) => {
                        document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
                        this.setState({
                            show: false,
                            startTime,
                            endTime,
                        });
                    }}
                    getDateExtra={(date) => {
                        return extra[+date];
                    }}
                    minDate={new Date(+new Date - 60 * 24 * 3600 * 1000)}
                    maxDate={new Date(+new Date + 365 * 24 * 3600 * 1000)}
                />
            </div>
        );
    }
}

ReactDOM.render(<BasicDemo />, document.getElementById('__react-content'));

// const ip = (document.body.children[3] as HTMLScriptElement).innerText.split('/')[2].split(':')[0];
// const elm = document.createElement('script');
// elm.src = `http://${ip}:1337/vorlon.js`;
// document.body.appendChild(elm);