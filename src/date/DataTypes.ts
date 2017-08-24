import SingleMonth from './SingleMonth';

export namespace Models {
    export enum SelectType {
        None,
        /** 单选 */
        Single,
        /** 起/至 */
        All,
        /** 区间仅选择了 起 */
        Only,
        /** 区间起 */
        Start,
        /** 区间中 */
        Middle,
        /** 区间止 */
        End,
    }

    export interface CellData {
        tick: number;
        dayOfMonth: number;
        selected: SelectType;
        isFirstOfMonth: boolean;
        isLastOfMonth: boolean;
        outOfDate: boolean;
    }

    export interface ExtraData {
        /** 扩展信息 */
        info?: string;
        /** 是否禁止选择 */
        disable?: boolean;
        /** (web only) 附加cell样式 className */
        cellCls?: any;
        cellRender?: (date: Date) => React.ReactNode;
    }

    export interface MonthData {
        title: string;
        firstDate: Date;
        lastDate: Date;
        weeks: Models.CellData[][];
        component?: React.ReactNode;
        height?: number;
        y?: number;
        updateLayout?: Function;
        componentRef?: SingleMonth;
    }

    export interface Locale {
        title: string;
        today: string;
        month: string;
        year: string;
        am: string;
        pm: string;
        dateFormat: string;
        dateTimeFormat: string;
        noChoose: string;
        week: string[];
        clear: string;
        selectTime: string;
        selectStartTime: string;
        selectEndTime: string;
        start: string;
        end: string;
        begin: string;
        over: string;
        begin_over: string;
        confirm: string;
        monthTitle: string;
        loadPrevMonth: string;
        yesterday: string;
        lastWeek: string;
        lastMonth: string;
    }
}