import React from 'react';
import Animate from 'rc-animate';
import TimePicker from './TimePicker';

import DatePicker from './DatePicker';
import ConfirmPanel from './calendar/ConfirmPanel';
import AnimateWrapper from './calendar/AnimateWrapper';
import zhCN from './locale/zh_CN';
import Header from './calendar/Header';
import { Models as DateModels } from './date/DataTypes';
import PropsType from './CalendarProps';

export type ExtraData = DateModels.ExtraData;
export { PropsType };

export class StateType {
    showTimePicker: boolean = false;
    timePickerTitle?: string;
    startDate?: Date = undefined;
    endDate?: Date = undefined;
    disConfirmBtn?: boolean = true;
}
export default class Calendar extends React.Component<PropsType, StateType> {
    static defaultProps = {
        visible: false,
        showHeader: true,
        locale: zhCN,
        pickTime: false,
        prefixCls: 'rmc-calendar',
        type: 'range',
        defaultTimeValue: new Date(2000, 0, 1, 8),
    } as PropsType;

    constructor(props: PropsType) {
        super(props);

        this.state = new StateType;
    }

    onSelectedDate = (date: Date) => {
        const { type, pickTime, defaultTimeValue } = this.props;
        const { startDate, endDate } = this.state;

        const newDate = pickTime ? this.mergeDateTime(date, defaultTimeValue) : date;

        switch (type) {
            case 'one':
                this.setState({
                    startDate: newDate,
                    disConfirmBtn: pickTime,
                });
                if (pickTime) {
                    this.setState({
                        showTimePicker: true,
                        timePickerTitle: '选择时间',
                    });
                }
                return;

            case 'range':
                if (!startDate || endDate) {
                    this.setState({
                        startDate: newDate,
                        endDate: undefined,
                        disConfirmBtn: true,
                    });
                    if (pickTime) {
                        this.setState({
                            showTimePicker: true,
                            timePickerTitle: '选择开始时间',
                        });
                    }
                } else {
                    this.setState({
                        timePickerTitle: '选择结束时间',
                        disConfirmBtn: false,
                    });
                    if (+newDate >= +startDate) {
                        this.setState({
                            endDate: pickTime ? new Date(+this.mergeDateTime(newDate, startDate) + 3600000) : newDate,
                        });
                    } else {
                        this.setState({
                            startDate: newDate,
                            endDate: startDate,
                        });
                    }
                }
                return;

            default:
                return;
        }
    }

    onClose = () => {
        this.setState(new StateType);
    }

    onCancel = () => {
        this.onClose();
        this.props.onCancel && this.props.onCancel();
    }

    onConfirm = () => {
        this.onClose();

        const { startDate, endDate } = this.state;
        this.props.onConfirm && this.props.onConfirm(startDate, endDate);
    }

    onTimeChange = (date: Date) => {
        const { startDate, endDate } = this.state;
        if (endDate) {
            this.setState({
                endDate: date,
            });
        } else if (startDate) {
            this.setState({
                startDate: date,
            });
        }
    }

    onClear = () => {
        this.setState({
            startDate: undefined,
            endDate: undefined,
            showTimePicker: false,
        });
    }

    mergeDateTime = (date?: Date, time?: Date) => {
        date = date || new Date;
        if (!time) return date;
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            time.getHours(),
            time.getMinutes()
        );
    }

    render() {
        const {
            type, locale = {} as Models.Locale, prefixCls, visible, showHeader, pickTime,
            infinite, infiniteOpt, initalMonths, defaultDate, minDate, maxDate, getDateExtra,
            defaultTimeValue,
        } = this.props;
        const {
            showTimePicker, timePickerTitle,
            startDate, endDate,
            disConfirmBtn
        } = this.state;

        return (
            <div className={`${prefixCls} calendar`}>
                <Animate showProp="visible" transitionName="fade">
                    <AnimateWrapper className="mask" visible={!!visible}>
                    </AnimateWrapper>
                </Animate>
                <Animate showProp="visible" transitionName="slide">
                    <AnimateWrapper className="content" visible={!!visible}>
                        {
                            showHeader &&
                            <Header
                                locale={locale}
                                showClear={!!startDate}
                                onCancel={this.onCancel}
                                onClear={this.onClear}
                            />
                        }
                        <DatePicker
                            prefixCls={prefixCls}
                            infinite={infinite}
                            infiniteOpt={infiniteOpt}
                            initalMonths={initalMonths}
                            defaultDate={defaultDate}
                            minDate={minDate}
                            maxDate={maxDate}
                            getDateExtra={getDateExtra}
                            onCellClick={this.onSelectedDate}
                            value={{
                                startDate: startDate,
                                endDate: endDate,
                            }}
                        />
                        {
                            showTimePicker &&
                            <TimePicker
                                locale={locale}
                                title={timePickerTitle}
                                defaultValue={defaultTimeValue}
                                value={endDate ? endDate : startDate}
                                onValueChange={this.onTimeChange}
                                minDate={minDate}
                                maxDate={maxDate}
                            />
                        }
                        {
                            startDate &&
                            <ConfirmPanel
                                type={type}
                                locale={locale}
                                startDateTime={startDate}
                                endDateTime={endDate}
                                onConfirm={this.onConfirm}
                                disableBtn={disConfirmBtn}
                                formatStr={pickTime ? locale.dateTimeFormat : locale.dateFormat}
                            />
                        }
                    </AnimateWrapper>
                </Animate>
            </div>
        );
    }
}
