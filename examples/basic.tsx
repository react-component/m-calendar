/* tslint:disable:no-console */

import 'rmc-picker/assets/index.css';
import 'rmc-date-picker/assets/index.css';
import 'rmc-calendar/assets/index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Calendar, { PropsType, ExtraData } from '../src/Calendar';

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

    renderBtn(text: string, config: PropsType = {}) {
        return <div style={{ background: 'orange', padding: 10, margin: 10, textAlign: 'center' }}
            onClick={() => {
                document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
                this.setState({
                    show: true,
                    config,
                });
            }}>
            {text}
        </div>;
    }

    render() {
        return (
            <div style={{ marginTop: 10, marginBottom: 10 }}>
                {this.renderBtn('选择日期时间区间', { pickTime: true })}
                {this.renderBtn('选择日期区间')}
                {this.renderBtn('选择日期时间', { type: 'one', pickTime: true })}
                {this.renderBtn('选择日期', { type: 'one' })}
                {this.renderBtn('选择日期时间区间(快捷)', { pickTime: true, showShortcut: true })}
                {this.renderBtn('选择日期区间(快捷)', { showShortcut: true })}
                {this.renderBtn('不使用无限滚动(无法向前滚动)', { infinite: false })}
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
                        this.setState({
                            show: false,
                            startTime,
                            endTime,
                        });
                    }}
                    getDateExtra={(date) => {
                        {/* return extra[+date]; */ }
                        return {};
                    }}
                    minDate={new Date(+new Date - 60 * 24 * 3600 * 1000)}
                    maxDate={new Date(+new Date + 365 * 24 * 3600 * 1000)}
                />
            </div>
        );
    }
}

ReactDOM.render(<BasicDemo />, document.getElementById('__react-content'));

const ip = (document.body.children[3] as HTMLScriptElement).innerText.split('/')[2].split(':')[0];
const elm = document.createElement('script');
elm.src = `http://${ip}:1337/vorlon.js`;
document.body.appendChild(elm);