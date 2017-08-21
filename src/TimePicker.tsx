import React from 'react';
import Picker from 'rmc-picker';
import MultiPicker from 'rmc-picker/lib/MultiPicker';

export interface PropsType {
    locale?: Object;
    title?: string;
    /** unit: minutes, default: 8am */
    defaultValue?: number;
    /** unit: minutes */
    value?: number;
    onValueChange?: (time: number) => void;
}
export interface StateType {
    value: string[];
}
export default class TimePicker extends React.PureComponent<PropsType, StateType> {
    static defaultProps = {
        // locale: zhCN,
        defaultValue: 8 * 60,
    };

    constructor(props: PropsType) {
        super(props);
        this.state = {
            value: [],
        };
    }

    onValueChange = (data: string[]) => {
        this.setState({ value: data });
        const isPM = data[0] === 'pm';
        const hours = isPM ? +data[1] + 12 : +data[1];
        const minutes = +data[2];
        this.props.onValueChange && this.props.onValueChange((hours * 60 + minutes) * 60000);
    }

    render() {
        const { title, defaultValue, value } = this.props;
        let useValue = value || defaultValue || 0;
        const showValue = [];
        if (useValue >= 12 * 60) {
            showValue.push('pm');
            useValue - 12 * 60;
        } else {
            showValue.push('am');
        }
        showValue.push((useValue / 60).toFixed(0));

        const hourPickers = [];
        for (let i = 1; i <= 12; i++) {
            hourPickers.push(<Picker.Item key={i} value={i + ''}>{i + ''}</Picker.Item>);
        }
        const minutePickers = [];
        for (let i = 0; i <= 59; i++) {
            const value = i < 10 ? '0' + i : i + '';
            minutePickers.push(<Picker.Item key={i} value={value}>{value}</Picker.Item>);
        }

        return (
            <div className="time-picker">
                <div className="title">{title}</div>
                <MultiPicker onValueChange={this.onValueChange} selectedValue={this.state.value}>
                    <Picker>
                        <Picker.Item value="am">上午</Picker.Item>
                        <Picker.Item value="pm">下午</Picker.Item>
                    </Picker>
                    <Picker>
                        {hourPickers}
                    </Picker>
                    <Picker>
                        {minutePickers}
                    </Picker>
                </MultiPicker>
            </div>
        );
    }
}