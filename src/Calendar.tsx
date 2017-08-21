import React from 'react';
import Animate from 'rc-animate';
import TimePicker from './TimePicker';

import DatePicker from './DatePicker';
import ConfirmPanel from './calendar/ConfirmPanel';
import AnimateWrapper from './calendar/AnimateWrapper';
import zhCN from './locale/zh_CN';
import WeekPanel from './date/WeekPanel';
import Header from './calendar/Header';
import { Models as DateModels } from './date/DataTypes';

export type ExtraData = DateModels.ExtraData;

export interface PropsType {
    /** (web only) 样式前缀，default: rmc-calendar */
    prefixCls?: string;
    /** 是否展示头部，default: true */
    showHeader?: boolean;
    /** 选择类型，default: range，one: 单日，range: 日期区间 */
    type?: 'one' | 'range';
    /** 选择时间，default: false */
    pickTime?: boolean;
    /** 是否展示，default: false */
    visible: boolean;
    /** 本地化 */
    locale?: Models.Locale;
    /** 值变化时回调 */
    onValueChange?: (startDateTime?: Date, endDateTime?: Date) => void;
    /** 关闭时回调 */
    onCancel?: () => void;
    /** 确认时回调 */
    onConfirm?: (startDateTime?: Date, endDateTime?: Date) => void;

    // DatePicker
    /** 无限滚动，default: true */
    infinite?: boolean;
    /** 无限滚动优化（大范围选择），default: false */
    infiniteOpt?: boolean;
    /** 初始化月个数，default: 6 */
    initalMonths?: number;
    /** 开始日期，default: today */
    defaultDate?: Date;
    /** 最小日期 */
    minDate?: Date;
    /** 最大日期 */
    maxDate?: Date;
    /** 日期扩展数据 */
    getDateExtra?: (date: Date) => ExtraData;
}
export class StateType {
    showTimePicker: boolean = false;
    timePickerTitle?: string;
    startDate?: Date;
    endDate?: Date;
    startTime?: number;
    endTime?: number;
    disConfirm?: boolean = true;
    defaultTime?: number;
}
export default class Calendar extends React.Component<PropsType, StateType> {
    static defaultProps = {
        visible: false,
        showHeader: true,
        locale: zhCN,
        pickTime: false,
        prefixCls: 'rmc-calendar',
        type: 'range',
    } as PropsType;

    constructor(props: PropsType) {
        super(props);

        this.state = new StateType;
    }

    onSelectedDate = (date: Date) => {
        const { type, pickTime } = this.props;
        const { startDate, endDate } = this.state;

        switch (type) {
            case 'one':
                this.setState({
                    startDate: date,
                });
                if (pickTime) {
                    this.setState({
                        showTimePicker: true,
                        timePickerTitle: '选择时间',
                        defaultTime: 8 * 60,
                    });
                }
                return;

            case 'range':
                if (!startDate || endDate) {
                    this.setState({
                        startDate: date,
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
                    if (+date >= +startDate) {
                        this.setState({
                            endDate: date,
                        });
                    } else {
                        this.setState({
                            startDate: date,
                            endDate: startDate,
                        });
                    }
                    this.setState({
                        disConfirm: false,
                    });
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
        this.props.onConfirm && this.props.onConfirm();
    }

    onTimeChange = (time: any) => {
        const { startDate, endDate } = this.state;
        if (endDate) {
            this.setState({
                endTime: time,
            });
        } else if (startDate) {
            this.setState({
                startTime: time,
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

    render() {
        const {
            locale, prefixCls, visible, showHeader, onConfirm, pickTime,
            infinite, infiniteOpt, initalMonths, defaultDate, minDate, maxDate, getDateExtra,
        } = this.props;
        const {
            showTimePicker, timePickerTitle,
            startDate, endDate, startTime, endTime,
            disConfirm, defaultTime
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
                                onValueChange={this.onTimeChange}
                            />
                        }
                        {
                            startDate &&
                            <ConfirmPanel
                                startDateTime={new Date(+startDate + (startTime || 0))}
                                endDateTime={endDate && new Date(+endDate + (endTime || 0))}
                                onConfirm={this.onConfirm}
                                disableBtn={disConfirm}
                                formatStr={pickTime ? 'yyyy年MM月dd日 星期 hh:mm' : 'yyyy年MM月dd日 星期'}
                            />
                        }
                    </AnimateWrapper>
                </Animate>
            </div>
        );
    }
}
