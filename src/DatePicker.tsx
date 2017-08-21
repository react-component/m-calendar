import * as React from 'react';
import Component, { PropsType, StateType } from './DatePicker.base';
import WeekPanel from './date/WeekPanel';
import SingleMonth from './date/SingleMonth';
import { Models } from './date/DataTypes';
import DOMScroller from 'zscroller/lib/DOMScroller';

export { PropsType }
export default class DatePicker extends Component {

    scroller: any;

    genMonthComponent = (data?: Models.MonthData) => {
        if (!data) return;

        return <SingleMonth key={data.title}
            monthData={data}
            onCellClick={this.onCellClick}
            getDateExtra={this.props.getDateExtra}
            ref={(dom) => {
                data.componentRef = dom || undefined;
                data.updateLayout = () => {
                    this.computeHeight(data, dom);
                };
                data.updateLayout();
            }}
        />;
    }

    computeHeight = (data: Models.MonthData, singleMonth: SingleMonth | null) => {
        if (singleMonth && singleMonth.wrapperDivDOM) {
            data.height = singleMonth.wrapperDivDOM.clientHeight;
            data.y = singleMonth.wrapperDivDOM.offsetTop;
        }
    }

    onCellClick = (single: SingleMonth, day: Models.CellData) => {
        if (!day.tick) return;

        this.props.onCellClick && this.props.onCellClick(new Date(day.tick));
    }

    createOnScroll = () => {
        let timer: any;
        let fullHeight = 0, clientHeight = 0, scrollTop = 0;

        return (data: { full: number, client: number, top: number }) => {
            const { full, client, top } = data;
            fullHeight = full;
            clientHeight = client;
            scrollTop = top;

            if (timer) {
                return;
            }

            timer = setTimeout(() => {
                timer = undefined;
                const time1 = +new Date;
                if (this.computeVisible(fullHeight, clientHeight, scrollTop)) {
                    const time2 = +new Date;
                    this.forceUpdate();
                    // console.log('forceUpdate', +new Date - time2);
                }
                // console.log('all', +new Date - time1);
            }, 64);
        };
    }

    setLayout = (dom: HTMLDivElement) => {
        if (!this.scroller) {
            const scrollHandler = this.createOnScroll();
            if (this.props.infinite) {
                this.scroller = new DOMScroller(dom.children[0], {
                    scrollingX: false,
                    onScroll: () => scrollHandler({
                        client: dom.clientHeight,
                        full: (dom.children[0] as HTMLDivElement).clientHeight,
                        top: this.scroller.getValues().top,
                    })
                }).scroller;

                this.scroller.activatePullToRefresh(40, function () {
                }, function () {
                }, () => {
                    this.canLoadPrev() && this.genMonthData(this.state.months[0].firstDate, -1);

                    this.visibleMonth = this.visibleMonth.slice(0, this.props.initalMonths);

                    this.state.months.forEach((m, index) => {
                        m.updateLayout && m.updateLayout();
                    });

                    this.scroller.finishPullToRefresh();
                });
            } else {
                this.scroller = true;
                dom.onscroll = (evt) => {
                    scrollHandler({
                        client: dom.clientHeight,
                        full: (evt.target as HTMLDivElement).clientHeight,
                        top: (evt.target as HTMLDivElement).scrollTop,
                    });
                };
            }
        }
    }

    render() {
        const { infinite, prefixCls = '' } = this.props;

        return (
            <div className={`${prefixCls} data-picker`}>
                <WeekPanel></WeekPanel>
                <div className="wrapper" style={{ overflow: infinite ? 'hidden' : 'scroll' }} ref={this.setLayout}>
                    <div>
                        {
                            this.canLoadPrev() && <div className="load-tip">加载上一个月</div>
                        }
                        <div className="months">
                            {
                                this.state.months.map((m, index) => {
                                    const hidden = m.height && this.visibleMonth.indexOf(m) < 0;
                                    if (hidden) {
                                        return <div key={m.title + '_shallow'} style={{ height: m.height }}></div>;
                                    }
                                    return m.component;

                                    {/* return <div key={m.title} style={{ visibility: hidden ? 'hidden' : 'visible' }}>
                                    {m.component}
                                </div>; */}
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}