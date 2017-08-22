import { Models } from './date/DataTypes';

export default interface PropsType {
    /** 本地化 */
    locale?: GlobalModels.Locale;
    /** 选择类型，default: range，one: 单日，range: 日期区间 */
    type?: 'one' | 'range';
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
    /** 选择区间包含不可用日期 */
    onSelectHasDisableDate?: (date: Date[]) => void;
}