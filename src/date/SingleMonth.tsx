import * as React from 'react';
import { Models } from './DataTypes';

export interface PropsType {
    monthData: Models.MonthData;
    getDateExtra?: (date: Date) => Models.ExtraData;
    onCellClick?: (data: Models.CellData) => void;
}
export default class SingleMonth extends React.PureComponent<PropsType, {
    weekComponents: React.ReactNode[]
}> {
    static defaultProps = {
    };

    public wrapperDivDOM: HTMLDivElement | null;

    constructor(props: PropsType) {
        super(props);

        this.state = {
            weekComponents: [],
        };
    }

    componentWillMount() {
        this.props.monthData.weeks.forEach((week, index) => {
            this.genWeek(week, index);
        });
    }

    genWeek = (weeksData: Models.CellData[], index: number) => {
        const { getDateExtra } = this.props;
        this.state.weekComponents[index] = (
            <div key={index} className="row">
                {
                    weeksData.map((day, dayOfWeek) => {
                        const extra = (getDateExtra && getDateExtra(new Date(day.tick))) || {};
                        let info = extra.info;
                        const disable = extra.disable || day.outOfDate;

                        let cls = 'date';
                        let lCls = 'left';
                        let rCls = 'right';
                        let infoCls = 'info';

                        if (dayOfWeek === 0 || dayOfWeek === 6) {
                            cls += ' grey';
                        }

                        if (disable) {
                            cls += ' disable';
                        } else if (info) {
                            cls += ' important';
                        }

                        if (day.selected) {
                            cls += ' date-selected';
                            let styleType = day.selected;
                            switch (styleType) {
                                case Models.SelectType.Only:
                                    info = '起';
                                    infoCls += ' date-selected';
                                    break;
                                case Models.SelectType.All:
                                    info = '起/至';
                                    infoCls += ' date-selected';
                                    break;

                                case Models.SelectType.Start:
                                    info = '起';
                                    infoCls += ' date-selected';
                                    if (dayOfWeek === 6 || day.isLastOfMonth) {
                                        styleType = Models.SelectType.All;
                                    }
                                    break;
                                case Models.SelectType.Middle:
                                    if (dayOfWeek === 0 || day.isFirstOfMonth) {
                                        if (day.isLastOfMonth || dayOfWeek === 6) {
                                            styleType = Models.SelectType.All;
                                        } else {
                                            styleType = Models.SelectType.Start;
                                        }
                                    } else if (dayOfWeek === 6 || day.isLastOfMonth) {
                                        styleType = Models.SelectType.End;
                                    }
                                    break;
                                case Models.SelectType.End:
                                    info = '至';
                                    infoCls += ' date-selected';
                                    if (dayOfWeek === 0 || day.isFirstOfMonth) {
                                        styleType = Models.SelectType.All;
                                    }
                                    break;
                            }

                            switch (styleType) {
                                case Models.SelectType.Single:
                                case Models.SelectType.Only:
                                case Models.SelectType.All:
                                    cls += ' selected-single';
                                    break;
                                case Models.SelectType.Start:
                                    cls += ' selected-start';
                                    rCls += ' date-selected';
                                    break;
                                case Models.SelectType.Middle:
                                    cls += ' selected-middle';
                                    lCls += ' date-selected';
                                    rCls += ' date-selected';
                                    break;
                                case Models.SelectType.End:
                                    cls += ' selected-end';
                                    lCls += ' date-selected';
                                    break;
                            }
                        }

                        const defaultContent = [
                            <div key="wrapper" className="date-wrapper">
                                <span className={lCls}></span>
                                <div className={cls}>
                                    {day.dayOfMonth}
                                </div>
                                <span className={rCls}></span>
                            </div>
                            ,
                            <div key="info" className={infoCls}>{info}</div>
                        ];

                        return (
                            <div key={dayOfWeek} className={`cell ${extra.cellCls || ''}`} onClick={() => {
                                !disable && this.props.onCellClick && this.props.onCellClick(day);
                            }}>
                                {
                                    extra.cellRender ?
                                        extra.cellRender(new Date(day.tick))
                                        :
                                        defaultContent
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    updateWeeks = (monthData?: Models.MonthData) => {
        (monthData || this.props.monthData).weeks.forEach((week, index) => {
            this.genWeek(week, index);
        });
    }

    componentWillReceiveProps(nextProps: PropsType) {
        if (this.props.monthData !== nextProps.monthData) {
            this.updateWeeks(nextProps.monthData);
        }
    }

    render() {
        const { title } = this.props.monthData;
        const { weekComponents } = this.state;

        return (
            <div className="single-month" ref={(dom) => this.wrapperDivDOM = dom}>
                <div className="header">
                    {title}
                </div>
                <div className="date">
                    {weekComponents}
                </div>
            </div>
        );
    }
}