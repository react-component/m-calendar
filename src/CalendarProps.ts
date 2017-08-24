import { Models } from './date/DataTypes';

export default interface PropsType {
    /** 入场方向，default: vertical，vertical: 垂直，horizontal: 水平 */
    enterDirection?: 'horizontal' | 'vertical';
    /** 本地化 */
    locale?: Models.Locale;
    /** 关闭时回调 */
    onCancel?: () => void;
    /** 确认时回调 */
    onConfirm?: (startDateTime?: Date, endDateTime?: Date) => void;
    /** 是否选择时间，default: false */
    pickTime?: boolean;
    /** (web only) 样式前缀，default: rmc-calendar */
    prefixCls?: string;
    /** 替换快捷选择栏，需要设置showShortcut: true */
    renderShortcut?: (select: (startDate?: Date, endDate?: Date) => void) => React.ReactNode;
    /** 是否展示头部，default: true */
    showHeader?: boolean;
    /** 快捷日期选择， default: false */
    showShortcut?: boolean;
    /** header title, default: {locale.title} */
    title?: string;
    /** 选择类型，default: range，one: 单日，range: 日期区间 */
    type?: 'one' | 'range';
    /** 是否显示，default: false */
    visible?: boolean;

    // DatePicker
    /** 显示开始日期，default: today */
    defaultDate?: Date;
    /** 日期扩展数据 */
    getDateExtra?: (date: Date) => Models.ExtraData;
    /** 无限滚动，default: true */
    infinite?: boolean;
    /** 无限滚动优化（大范围选择），default: false */
    infiniteOpt?: boolean;
    /** 初始化月个数，default: 6 */
    initalMonths?: number;
    /** 最大日期 */
    maxDate?: Date;
    /** 最小日期 */
    minDate?: Date;
    /** 选择区间包含不可用日期 */
    onSelectHasDisableDate?: (date: Date[]) => void;

    // TimePicker
    /** 默认时间选择值 */
    defaultTimeValue?: Date;
    TimePickerPrefixCls?: string;
    TimePickerPickerPrefixCls?: string;
}