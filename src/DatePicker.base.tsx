import * as React from 'react';
import { Models } from './date/DataTypes';

export interface PropsType {
    /** (web only) 样式前缀 */
    prefixCls?: string;
    /** 无限滚动，default: true */
    infinite?: boolean;
    /** 无限滚动优化（大范围选择），default: false */
    infiniteOpt?: boolean;
    /** 初始化月个数，default: 6 */
    initalMonths?: number;
    /** 默认日期，default: today */
    defaultDate?: Date;
    /** 最小日期 */
    minDate?: Date;
    /** 最大日期 */
    maxDate?: Date;
    /** 选择值 */
    value?: {
        startDate?: Date;
        endDate?: Date;
    };
    /** 日期扩展数据 */
    getDateExtra?: (date: Date) => Models.ExtraData;
    /** 日期点击回调 */
    onCellClick?: (date: Date) => void;
}
export interface StateType {
    months: Models.MonthData[];
}
export default abstract class DatePicker extends React.PureComponent<PropsType, StateType> {
    static defaultProps = {
        prefixCls: 'rmc-calendar',
        infinite: true,
        infiniteOpt: false,
        defaultDate: new Date,
        initalMonths: 6,
    } as PropsType;

    visibleMonth: Models.MonthData[] = [];
    abstract genMonthComponent: (data: Models.MonthData) => React.ReactNode;

    constructor(props: PropsType) {
        super(props);

        this.state = {
            months: [],
        };
    }

    componentWillReceiveProps(nextProps: PropsType) {
        if (this.props.value !== nextProps.value) {
            const oldValue = this.props.value;
            if (oldValue && oldValue.startDate) {
                this.selectDateRange(oldValue.startDate, oldValue.endDate, true);
            }
            if (nextProps.value && nextProps.value.startDate) {
                this.selectDateRange(nextProps.value.startDate, nextProps.value.endDate);
            }
        }
    }

    componentWillMount() {
        const { initalMonths = 6, defaultDate } = this.props;
        for (let i = 0; i < initalMonths; i++) {
            this.canLoadNext() && this.genMonthData(defaultDate, i);
        }
        this.visibleMonth = [...this.state.months];
        this.forceUpdate();
    }

    getMonthDate(date = new Date, addMonth = 0) {
        const y = date.getFullYear(), m = date.getMonth();
        return {
            firstDate: new Date(y, m + addMonth, 1),
            lastDate: new Date(y, m + 1 + addMonth, 0),
        };
    }

    canLoadPrev() {
        const { minDate } = this.props;
        return !minDate || this.state.months.length <= 0 || +this.getMonthDate(minDate).firstDate < +this.state.months[0].firstDate;
    }

    canLoadNext() {
        const { maxDate } = this.props;
        return !maxDate || this.state.months.length <= 0 || +this.getMonthDate(maxDate).firstDate > +this.state.months[this.state.months.length - 1].firstDate;
    }

    genWeekData = (firstDate: Date) => {
        const minDateTime = +(this.props.minDate || 0);
        const maxDateTime = +(this.props.maxDate || Number.POSITIVE_INFINITY);

        const weeks: Models.CellData[][] = [];
        const nextMonth = this.getMonthDate(firstDate, 1).firstDate;
        let currentDay = firstDate;
        let currentWeek: Models.CellData[] = [];
        weeks.push(currentWeek);

        let startWeekday = currentDay.getDay();
        if (startWeekday > 0) {
            for (let i = 0; i < startWeekday; i++) {
                currentWeek.push({} as Models.CellData);
            }
        }
        while (currentDay < nextMonth) {
            if (currentWeek.length === 7) {
                currentWeek = [];
                weeks.push(currentWeek);
            }
            const dayOfMonth = currentDay.getDate();
            const tick = +currentDay;
            currentWeek.push({
                tick,
                dayOfMonth,
                selected: Models.SelectType.None,
                isFirstOfMonth: dayOfMonth === 1,
                isLastOfMonth: false,
                outOfDate: tick < minDateTime || tick > maxDateTime,
            });
            currentDay = new Date(currentDay.getTime() + 3600 * 24 * 1000);
        }
        currentWeek[currentWeek.length - 1].isLastOfMonth = true;
        return weeks;
    }

    genMonthData(date?: Date, addMonth: number = 0) {
        if (!date) {
            date = addMonth >= 0 ? this.state.months[this.state.months.length - 1].firstDate : this.state.months[0].firstDate;
        }
        if (!date) {
            date = new Date;
        }
        const { firstDate, lastDate } = this.getMonthDate(date, addMonth);

        const weeks = this.genWeekData(firstDate);
        const title = `${firstDate.getFullYear()}年${firstDate.getMonth() + 1}月`;
        const data = {
            title,
            firstDate,
            lastDate,
            weeks,
        } as Models.MonthData;
        data.component = this.genMonthComponent(data);
        if (addMonth >= 0) {
            this.state.months.push(data);
        } else {
            this.state.months.unshift(data);
        }
        return data;
    }

    inDate(date: number, tick: number) {
        return date <= tick && tick < date + 24 * 3600000;
    }

    selectDateRange = (startDate: Date, endDate?: Date, clear = false) => {
        const { getDateExtra } = this.props;
        const time1 = +startDate, time2 = endDate ? +endDate : 0;
        const startDateTick = !time2 || time1 < time2 ? time1 : time2;
        const endDateTick = time2 && time1 > time2 ? time1 : time2;

        const startMonthDate = this.getMonthDate(new Date(startDateTick)).firstDate;
        const endMonthDate = endDateTick ? new Date(endDateTick) : this.getMonthDate(new Date(startDateTick)).lastDate;

        let goback = false, needUpdate = false;
        this.state.months
            .filter(m => {
                return m.firstDate >= startMonthDate && m.firstDate <= endMonthDate;
            })
            .forEach(m => {
                m.weeks.forEach(w => w
                    .filter(d => {
                        if (!endDateTick) {
                            return d.tick && this.inDate(startDateTick, d.tick);
                        } else {
                            return d.tick && d.tick >= startDateTick && d.tick <= endDateTick;
                        }
                    })
                    .forEach(d => {
                        const oldValue = d.selected;
                        if (clear) {
                            d.selected = Models.SelectType.None;
                        } else {
                            const info = getDateExtra && getDateExtra(new Date(d.tick)) || {};
                            if (goback || d.outOfDate || info.disable) {
                                goback = true;
                                return;
                            }
                            if (this.inDate(startDateTick, d.tick)) {
                                if (!endDateTick) {
                                    d.selected = Models.SelectType.Only;
                                } else if (startDateTick !== endDateTick) {
                                    d.selected = Models.SelectType.Start;
                                } else {
                                    d.selected = Models.SelectType.Single;
                                }
                            } else if (this.inDate(endDateTick, d.tick)) {
                                d.selected = Models.SelectType.End;
                            } else {
                                d.selected = Models.SelectType.Middle;
                            }
                        }
                        needUpdate = needUpdate || d.selected !== oldValue;
                    })
                );
                if (!goback && needUpdate && m.componentRef) {
                    m.componentRef.updateWeeks();
                    m.componentRef.forceUpdate();
                };
            });
        if (goback) {
            this.selectDateRange(startDate, endDate, true);
        }
    }

    computeVisible = (fullHeight: number, clientHeight: number, scrollTop: number) => {
        const canScrollHeight = fullHeight - clientHeight;
        const toBottom = canScrollHeight - scrollTop;

        let needUpdate = false;
        const MAX_VIEW_PORT = clientHeight * 2;
        const MIN_VIEW_PORT = clientHeight;

        // 大缓冲区外过滤规则
        const filterFunc = (vm: Models.MonthData) => vm.y && vm.height && (vm.y + vm.height > scrollTop - MAX_VIEW_PORT && vm.y < scrollTop + clientHeight + MAX_VIEW_PORT);

        if (this.props.infiniteOpt && this.visibleMonth.length > 12) {
            this.visibleMonth = this.visibleMonth.filter(filterFunc).sort((a, b) => +a.firstDate - +b.firstDate);
        }

        // 当小缓冲区不满时填充
        if (this.visibleMonth.length > 0) {
            const last = this.visibleMonth[this.visibleMonth.length - 1];
            if (last.y !== undefined && last.height && last.y + last.height < scrollTop + clientHeight + MIN_VIEW_PORT) {
                const lastIndex = this.state.months.indexOf(last);
                for (let i = 1; i <= 2; i++) {
                    const index = lastIndex + i;
                    if (index < this.state.months.length && this.visibleMonth.indexOf(this.state.months[index]) < 0) {
                        this.visibleMonth.push(this.state.months[index]);
                    } else {
                        this.canLoadNext() && this.genMonthData(undefined, 1);
                    }
                }
                needUpdate = true;
            }

            const first = this.visibleMonth[0];
            if (first.y !== undefined && first.height && first.y > scrollTop - MIN_VIEW_PORT) {
                const firstIndex = this.state.months.indexOf(first);
                for (let i = 1; i <= 2; i++) {
                    const index = firstIndex - i;
                    if (index >= 0 && this.visibleMonth.indexOf(this.state.months[index]) < 0) {
                        this.visibleMonth.unshift(this.state.months[index]);
                        needUpdate = true;
                    }
                }
            }
        } else if (this.state.months.length > 0) {
            this.visibleMonth = this.state.months.filter(filterFunc);
            needUpdate = true;
        }

        return needUpdate;
    }
}