/* tslint:disable:no-console */

import 'rmc-picker/assets/index.css';
import 'rmc-date-picker/assets/index.css';
import 'rmc-calendar/assets/index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Calendar, { ExtraData } from '../src/Calendar';

const extra: { [key: string]: ExtraData } = {
    1501516800000: { info: '建军节' },
    '2017/08/14': { info: '百阿', disable: true },
    '2017/08/15': { info: '百阿', disable: true },
    '2017/08/16': { info: '百阿', disable: true },
    '2017/08/17': { info: '百阿', disable: true },
    '2017/08/18': { info: '百阿', disable: true },
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

class BasicDemo extends React.Component<any, any> {
    originbodyScrollY = document.getElementsByTagName('body')[0].style.overflowY;

    constructor(props: any) {
        super(props);
        this.state = {
            show: false,
        };
    }

    render() {
        return (
            <div style={{ marginTop: 10, marginBottom: 10 }}>
                <div style={{ background: 'orange', padding: 10, textAlign: 'center' }}
                    onClick={() => {
                        document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
                        this.setState({
                            show: true,
                        });
                    }}>
                    选择日期时间
                </div>
                <div>
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
                    visible={this.state.show}
                    pickTime={true}
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

const ip = (document.body.children[3] as HTMLScriptElement).innerText.split('/')[2].split(':')[0];
const elm = document.createElement('script');
elm.src = `http://${ip}:1337/vorlon.js`;
document.body.appendChild(elm);