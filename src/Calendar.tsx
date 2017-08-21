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

export class StateType {
    showTimePicker: boolean = false;
    timePickerTitle?: string;
    startDate?: Date = undefined;
    endDate?: Date = undefined;
    disConfirm?: boolean = true;
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

        const newDate = this.mergeDateTime(date, defaultTimeValue);

        switch (type) {
            case 'one':
                this.setState({
                    startDate: newDate,
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
                        disConfirm: true,
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
                        disConfirm: false,
                    });
                    if (+newDate >= +startDate) {
                        this.setState({
                            endDate: new Date(+(newDate || 0) + 3600000),
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
            locale = {} as Models.Locale, prefixCls, visible, showHeader, pickTime,
            infinite, infiniteOpt, initalMonths, defaultDate, minDate, maxDate, getDateExtra,
            defaultTimeValue,
        } = this.props;
        const {
            showTimePicker, timePickerTitle,
            startDate, endDate,
            disConfirm
        } = this.state;

        return (
            <div className={`${prefixCls} calendar`}>
                <Animate showProp="visible" transitionName="fade">
                    <AnimateWrapper className="mask" visible={visible}>
                    </AnimateWrapper>
                </Animate>
                <Animate showProp="visible" transitionName="slide">
                    <AnimateWrapper className="content" visible={visible}>
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
                                locale={locale}
                                startDateTime={startDate}
                                endDateTime={endDate}
                                onConfirm={this.onConfirm}
                                disableBtn={disConfirm}
                                formatStr={pickTime ? locale.dateTimeFormat : locale.dateFormat}
                            />
                        }
                    </AnimateWrapper>
                </Animate>
            </div>
        );
    }
}
