import React from 'react';
import Animate from 'rc-animate';
import TimePicker from './TimePicker';

import DatePicker from './DatePicker';
import ConfirmPanel from './calendar/ConfirmPanel';
import ShortcutPanel from './calendar/ShortcutPanel';
import AnimateWrapper from './calendar/AnimateWrapper';
import Header from './calendar/Header';
import { Models } from './date/DataTypes';
import PropsType from './CalendarProps';

import { mergeDateTime } from './util';

import defaultLocale from './locale/zh_CN';

export type ExtraData = Models.ExtraData;
export { PropsType };

export class StateType {
  showTimePicker: boolean = false;
  timePickerTitle?: string;
  startDate?: Date = undefined;
  endDate?: Date = undefined;
  disConfirmBtn?: boolean = true;
  clientHight?: number = 0;
}
export default class Calendar extends React.PureComponent<PropsType, StateType> {
  public static DefaultHeader = Header;
  public static DefaultShortcut = ShortcutPanel;

  static defaultProps = {
    visible: false,
    showHeader: true,
    locale: defaultLocale,
    pickTime: false,
    showShortcut: false,
    prefixCls: 'rmc-calendar',
    type: 'range',
    defaultTimeValue: new Date(2000, 0, 1, 8),
  } as PropsType;

  constructor(props: PropsType) {
    super(props);

    this.state = new StateType;
    if (props.defaultValue) {
      const defaultValue = props.defaultValue;
      this.state = {
        ...this.state,
        ...this.selectDate(defaultValue[1], true, { startDate: defaultValue[0] }, props),
      };
    }
  }

  componentWillReceiveProps(nextProps: PropsType) {
    if (!this.props.visible && nextProps.visible && nextProps.defaultValue) {
      this.shortcutSelect(nextProps.defaultValue[0], nextProps.defaultValue[1], nextProps);
    }
  }

  selectDate = (date: Date, useDateTime = false, oldState: { startDate?: Date, endDate?: Date } = {}, props = this.props) => {
    if (!date) return {} as StateType;
    let newState = {} as StateType;
    const { type, pickTime, defaultTimeValue, locale = {} as Models.Locale } = props;
    const newDate = pickTime && !useDateTime ? mergeDateTime(date, defaultTimeValue) : date;
    const { startDate, endDate } = oldState;

    switch (type) {
      case 'one':
        newState = {
          ...newState,
          startDate: newDate,
          disConfirmBtn: false,
        };
        if (pickTime) {
          newState = {
            ...newState,
            timePickerTitle: locale.selectTime,
            showTimePicker: true,
          };
        }
        break;

      case 'range':
        if (!startDate || endDate) {
          newState = {
            ...newState,
            startDate: newDate,
            endDate: undefined,
            disConfirmBtn: true,
          };
          if (pickTime) {
            newState = {
              ...newState,
              timePickerTitle: locale.selectStartTime,
              showTimePicker: true,
            };
          }
        } else {
          newState = {
            ...newState,
            timePickerTitle: +newDate >= +startDate ? locale.selectEndTime : locale.selectStartTime,
            disConfirmBtn: false,
            endDate: (pickTime && !useDateTime && +newDate >= +startDate) ?
              new Date(+mergeDateTime(newDate, startDate) + 3600000) : newDate,
          };
        }
        break;
    }
    return newState;
  }

  onSelectedDate = (date: Date) => {
    const { startDate, endDate } = this.state;
    const { onSelect } = this.props;
    if (onSelect) {
      let value = onSelect(date, [startDate, endDate]);
      if (value) {
        this.shortcutSelect(value[0], value[1]);
        return;
      }
    }
    this.setState(this.selectDate(date, false, { startDate, endDate }));
  }

  onSelectHasDisableDate = (date: Date[]) => {
    this.onClear();
    if (this.props.onSelectHasDisableDate) {
      this.props.onSelectHasDisableDate(date);
    }
  }

  onClose = () => {
    this.setState(new StateType);
  }

  onCancel = () => {
    this.props.onCancel && this.props.onCancel();
    this.onClose();
  }

  onConfirm = () => {
    const { onConfirm } = this.props;
    let { startDate, endDate } = this.state;
    if (startDate && endDate && +startDate > +endDate) {
      return onConfirm && onConfirm(endDate, startDate);
    }
    onConfirm && onConfirm(startDate, endDate);
    this.onClose();
  }

  onTimeChange = (date: Date) => {
    const { startDate, endDate } = this.state;
    if (endDate) {
      this.setState({
        endDate: date,
      });
    } else if (startDate) {
      this.setState({
        startDate: date,
      });
    }
  }

  onClear = () => {
    this.setState({
      startDate: undefined,
      endDate: undefined,
      showTimePicker: false,
    });
    this.props.onClear && this.props.onClear();
  }

  shortcutSelect = (startDate: Date, endDate: Date, props = this.props) => {
    this.setState({
      startDate,
      ...this.selectDate(endDate, true, { startDate }, props),
      showTimePicker: false,
    });
  }

  setClientHeight = (height: number) => {
    this.setState({
      clientHight: height,
    });
  }

  render() {
    const {
      type, title, locale = {} as Models.Locale, prefixCls, visible, pickTime, showShortcut, renderHeader,
      infiniteOpt, initalMonths, defaultDate, minDate, maxDate, getDateExtra, rowSize,
      defaultTimeValue, renderShortcut, enterDirection, timePickerPrefixCls, timePickerPickerPrefixCls,
      style,
    } = this.props;
    const {
      showTimePicker, timePickerTitle,
      startDate, endDate,
      disConfirmBtn, clientHight
    } = this.state;

    const headerProps = {
      title,
      locale,
      showClear: !!startDate,
      onCancel: this.onCancel,
      onClear: this.onClear,
    };

    return (
      <div className={`${prefixCls}`} style={style}>
        <Animate showProp="visible" transitionName="fade">
          <AnimateWrapper className="mask" visible={!!visible}>
          </AnimateWrapper>
        </Animate>
        <Animate showProp="visible" transitionName={enterDirection === 'horizontal' ? 'slideH' : 'slideV'}>
          <AnimateWrapper className="content" visible={!!visible}>
            {
              renderHeader ? renderHeader(headerProps) : <Header {...headerProps} />
            }
            <DatePicker
              locale={locale}
              type={type}
              prefixCls={prefixCls}
              infiniteOpt={infiniteOpt}
              initalMonths={initalMonths}
              defaultDate={defaultDate}
              minDate={minDate}
              maxDate={maxDate}
              getDateExtra={getDateExtra}
              onCellClick={this.onSelectedDate}
              onSelectHasDisableDate={this.onSelectHasDisableDate}
              onLayout={this.setClientHeight}
              startDate={startDate}
              endDate={endDate}
              rowSize={rowSize}
            />
            {
              showTimePicker &&
              <TimePicker
                prefixCls={timePickerPrefixCls}
                pickerPrefixCls={timePickerPickerPrefixCls}
                locale={locale}
                title={timePickerTitle}
                defaultValue={defaultTimeValue}
                value={endDate ? endDate : startDate}
                onValueChange={this.onTimeChange}
                minDate={minDate}
                maxDate={maxDate}
                clientHeight={clientHight}
              />
            }
            {
              showShortcut && !showTimePicker &&
              (
                renderShortcut ?
                  renderShortcut(this.shortcutSelect) :
                  <ShortcutPanel locale={locale} onSelect={this.shortcutSelect} />
              )
            }
            {
              startDate &&
              <ConfirmPanel
                type={type}
                locale={locale}
                startDateTime={startDate}
                endDateTime={endDate}
                onConfirm={this.onConfirm}
                disableBtn={disConfirmBtn}
                formatStr={pickTime ? locale.dateTimeFormat : locale.dateFormat}
              />
            }
          </AnimateWrapper>
        </Animate>
      </div>
    );
  }
}
