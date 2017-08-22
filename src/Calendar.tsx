import React from 'react';
import Animate from 'rc-animate';
import TimePicker from './TimePicker';

import DatePicker from './DatePicker';
import ConfirmPanel from './calendar/ConfirmPanel';
import ShortcutPanel from './calendar/ShortcutPanel';
import AnimateWrapper from './calendar/AnimateWrapper';
import zhCN from './locale/zh_CN';
import Header from './calendar/Header';
import { Models as DateModels } from './date/DataTypes';
import PropsType from './CalendarProps';

import { mergeDateTime } from './util';

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
        showShortcut: false,
        prefixCls: 'rmc-calendar',
        type: 'range',
        defaultTimeValue: new Date(2000, 0, 1, 8),
    } as PropsType;

    constructor(props: PropsType) {
        super(props);

        this.state = new StateType;
    }

    selectDate = (date: Date, useDateTime = false, startDate?: Date, endDate?: Date) => {
        if (!date) return {} as StateType;
        let newState = {} as StateType;
        const { type, pickTime, defaultTimeValue } = this.props;
        const newDate = pickTime && !useDateTime ? mergeDateTime(date, defaultTimeValue) : date;

        switch (type) {
            case 'one':
                newState = {
                    ...newState,
                    startDate: newDate,
                    disConfirmBtn: false,
                };
                if (pickTime) {
                    newState = {
                        ...newState,
                        timePickerTitle: '选择时间',
                        showTimePicker: true,
                    };
                }
                break;

            case 'range':
                if (!startDate || endDate) {
                    newState = {
                        ...newState,
                        startDate: newDate,
                        endDate: undefined,
                        disConfirmBtn: true,
                    };
                    if (pickTime) {
                        newState = {
                            ...newState,
                            timePickerTitle: '选择开始时间',
                            showTimePicker: true,
                        };
                    }
                } else {
                    newState = {
                        ...newState,
                        timePickerTitle: +newDate >= +startDate ? '选择结束时间' : '选择时间',
                        showTimePicker: true,
                        disConfirmBtn: false,
                        endDate: (pickTime && !useDateTime && +newDate >= +startDate) ?
                            new Date(+mergeDateTime(newDate, startDate) + 3600000) : newDate,
                    };
                }
                break;
        }
        return newState;
    }

    onSelectedDate = (date: Date) => {
        const { startDate, endDate } = this.state;
        this.setState(this.selectDate(date, false, startDate, endDate));
    }

    onSelectHasDisableDate = (date: Date[]) => {
        this.onClear();
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
        const { onConfirm } = this.props;
        let { startDate, endDate } = this.state;
        if (startDate && endDate && +startDate > +endDate) {
            return onConfirm && onConfirm(endDate, startDate);
        }
        onConfirm && onConfirm(startDate, endDate);
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

    shortcutSelect = (startDate: Date, endDate: Date) => {
        const state = this.selectDate(startDate, true);
        this.setState({
            ...state,
            ...this.selectDate(endDate, true, state.startDate),
            showTimePicker: false,
        });
    }

    render() {
        const {
            type, locale = {} as Models.Locale, prefixCls, visible, showHeader, pickTime, showShortcut,
            infinite, infiniteOpt, initalMonths, defaultDate, minDate, maxDate, getDateExtra,
            defaultTimeValue, renderShortcut, enterDirection,
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
                <Animate showProp="visible" transitionName={enterDirection === 'horizontal' ? 'slideH' : 'slideV'}>
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
                            type={type}
                            prefixCls={prefixCls}
                            infinite={infinite}
                            infiniteOpt={infiniteOpt}
                            initalMonths={initalMonths}
                            defaultDate={defaultDate}
                            minDate={minDate}
                            maxDate={maxDate}
                            getDateExtra={getDateExtra}
                            onCellClick={this.onSelectedDate}
                            onSelectHasDisableDate={this.onSelectHasDisableDate}
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
                            showShortcut && !showTimePicker &&
                            (
                                renderShortcut ?
                                    renderShortcut(this.shortcutSelect) :
                                    <ShortcutPanel onSelect={this.shortcutSelect} />
                            )
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
