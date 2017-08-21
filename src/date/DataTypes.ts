import SingleMonth from './SingleMonth';

export namespace Models {
    export enum SelectType {
        None,
        Single,
        Only,
        Start,
        Middle,
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
}