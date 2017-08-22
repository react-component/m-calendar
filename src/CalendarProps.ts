import { Models as DateModels } from './date/DataTypes';

export default interface PropsType {
    /** (web only) 样式前缀，default: rmc-calendar */
    prefixCls?: string;
    /** 是否展示头部，default: true */
    showHeader?: boolean;
    /** header title, defualt: {locale.title} */
    title?: string;
    /** 选择类型，default: range，one: 单日，range: 日期区间 */
    type?: 'one' | 'range';
    /** 选择时间，default: false */
    pickTime?: boolean;
    /** 快捷日期选择， default: false */
    showShortcut?: boolean;
    /** 是否展示，default: false */
    visible?: boolean;
    /** 本地化 */
    locale?: Models.Locale;
    /** 替换快捷选择栏，需要设置showShortcut: true */
    renderShortcut?: (select: (startDate?: Date, endDate?: Date) => void) => React.ReactNode;
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
    getDateExtra?: (date: Date) => DateModels.ExtraData;

    // TimePicker
    /** 默认时间选择值 */
    defaultTimeValue?: Date;
}