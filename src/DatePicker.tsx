import * as React from 'react';
import PropsType from './DatePickerProps';
import Component from './DatePicker.base';
import WeekPanel from './date/WeekPanel';
import SingleMonth from './date/SingleMonth';
import { Models } from './date/DataTypes';

export { PropsType };
export default class DatePicker extends Component {

  panel: HTMLDivElement;
  transform: string = '';

  genMonthComponent = (data?: Models.MonthData) => {
    if (!data) return;

    return <SingleMonth key={data.title}
      locale={this.props.locale || {} as Models.Locale}
      monthData={data}
      rowSize={this.props.rowSize}
      onCellClick={this.onCellClick}
      getDateExtra={this.props.getDateExtra}
      ref={(dom) => {
        // FIXME?: sometimes will callback twice, and the second is null, when use preact.
        data.componentRef = dom || data.componentRef || undefined;
        data.updateLayout = () => {
          this.computeHeight(data, dom);
        };
        data.updateLayout();
      }}
    />;
  }

  computeHeight = (data: Models.MonthData, singleMonth: SingleMonth | null) => {
    if (singleMonth && singleMonth.wrapperDivDOM) {
      // preact, ref时dom有可能无height, offsetTop数据。
      if (!data.height && !singleMonth.wrapperDivDOM.clientHeight) {
        setTimeout(() => this.computeHeight(data, singleMonth), 500);
        return;
      }
      data.height = singleMonth.wrapperDivDOM.clientHeight || data.height || 0;
      data.y = singleMonth.wrapperDivDOM.offsetTop || data.y || 0;
    }
  }

  setLayout = (dom: HTMLDivElement) => {
    if (dom) {
      const { onLayout } = this.props;
      onLayout && onLayout(dom.clientHeight);

      const scrollHandler = this.createOnScroll();
      dom.onscroll = (evt) => {
        scrollHandler({
          client: dom.clientHeight,
          full: (evt.currentTarget as HTMLDivElement).clientHeight,
          top: (evt.currentTarget as HTMLDivElement).scrollTop,
        });
      };
    }
  }

  setPanel = (dom: HTMLDivElement) => {
    this.panel = dom;
  }

  // tslint:disable-next-line:member-ordering
  touchHandler = (() => {
    const initDelta = 0;
    let lastY = 0;
    let delta = initDelta;

    return {
      onTouchStart: (evt: React.TouchEvent<HTMLDivElement>) => {
        lastY = evt.touches[0].screenY;
        delta = initDelta;
      },
      onTouchMove: (evt: React.TouchEvent<HTMLDivElement>) => {
        const ele = evt.currentTarget;
        const isReachTop = ele.scrollTop === 0;

        if (isReachTop) {
          delta = evt.touches[0].screenY - lastY;
          if (delta > 0) {
            evt.preventDefault();
            if (delta > 80) {
              delta = 80;
            }
          } else {
            delta = 0;
          }
          this.setTransform(this.panel.style, `translate3d(0,${delta}px,0)`);
        }
      },

      onTouchEnd: () => {
        this.touchHandler.onFinish();
      },

      onTouchCancel: () => {
        this.touchHandler.onFinish();
      },

      onFinish: () => {
        if (delta > 40 && this.canLoadPrev()) {
          this.genMonthData(this.state.months[0].firstDate, -1);

          this.visibleMonth = this.state.months.slice(0, this.props.initalMonths);

          this.state.months.forEach((m) => {
            m.updateLayout && m.updateLayout();
          });
          this.forceUpdate();
        }
        this.setTransform(this.panel.style, `translate3d(0,0,0)`);
        this.setTransition(this.panel.style, '.3s');
        setTimeout(() => {
          this.setTransition(this.panel.style, '');
        }, 300);
      }
    };
  })();

  setTransform(nodeStyle: CSSStyleDeclaration, value: any) {
    this.transform = value;
    nodeStyle.transform = value;
    nodeStyle.webkitTransform = value;
  }

  setTransition(nodeStyle: CSSStyleDeclaration, value: any) {
    nodeStyle.transition = value;
    nodeStyle.webkitTransition = value;
  }

  render() {
    const { prefixCls = '', locale = {} as Models.Locale } = this.props;
    const style: any = {
      transform: this.transform,
    };

    return (
      <div className={`${prefixCls} date-picker`}>
        <WeekPanel locale={locale} />
        <div className="wrapper" style={{
          overflowX: 'hidden',
          overflowY: 'visible',
        }} ref={this.setLayout}
          onTouchStart={this.touchHandler.onTouchStart}
          onTouchMove={this.touchHandler.onTouchMove}
          onTouchEnd={this.touchHandler.onTouchEnd}
          onTouchCancel={this.touchHandler.onTouchCancel}>
          <div style={style} ref={this.setPanel}>
            {
              this.canLoadPrev() && <div className="load-tip">{locale.loadPrevMonth}</div>
            }
            <div className="months">
              {
                this.state.months.map((m) => {
                  const hidden = m.height && this.visibleMonth.indexOf(m) < 0;
                  if (hidden) {
                    return <div key={m.title + '_shallow'} style={{ height: m.height }}></div>;
                  }
                  return m.component;
                })
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
