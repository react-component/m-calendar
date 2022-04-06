import React from 'react';
import DateTimePicker from 'rmc-date-picker';
import { Models } from './date/DataTypes';

export interface PropsType {
  locale: Models.Locale;
  prefixCls?: string;
  pickerPrefixCls?: string;
  title?: string;
  defaultValue?: Date;
  value?: Date;
  onValueChange?: (time: Date) => void;

  minDate?: Date;
  maxDate?: Date;
  clientHeight?: number;
}
export interface StateType {
}
export default class TimePicker extends React.PureComponent<PropsType, StateType> {
  static defaultProps = {
    minDate: new Date(0, 0, 0, 0, 0),
    maxDate: new Date(9999, 11, 31, 23, 59, 59),
    defaultValue: new Date(2000, 1, 1, 8),
  } as PropsType;

  onDateChange = (date: Date) => {
    const { onValueChange } = this.props;
    onValueChange && onValueChange(date);
  }

  getMinTime(date?: Date) {
    const minDate = this.props.minDate as Date;
    if (!date ||
      date.getFullYear() > minDate.getFullYear() ||
      date.getMonth() > minDate.getMonth() ||
      date.getDate() > minDate.getDate()
    ) {
      return TimePicker.defaultProps.minDate;
    }
    return minDate;
  }

  getMaxTime(date?: Date) {
    const maxDate = this.props.maxDate as Date;
    if (!date ||
      date.getFullYear() < maxDate.getFullYear() ||
      date.getMonth() < maxDate.getMonth() ||
      date.getDate() < maxDate.getDate()
    ) {
      return TimePicker.defaultProps.maxDate;
    }
    return maxDate;
  }

  render() {
    const { locale, title, value, defaultValue, prefixCls, pickerPrefixCls, clientHeight, ...timePickerProps } = this.props;
    const date = value || defaultValue || undefined;
    const height = (clientHeight && clientHeight * 3 / 8 - 52) || Number.POSITIVE_INFINITY;

    return (
      <div className="time-picker">
        <div className="title">{title}</div>
        <DateTimePicker
          prefixCls={prefixCls}
          pickerPrefixCls={pickerPrefixCls}
          style={{
            height: height > 164 || height < 0 ? 164 : height,
            overflow: 'hidden'
          } as React.CSSProperties}
          mode="time"
          date={date}
          locale={locale}
          minDate={this.getMinTime(date)}
          maxDate={this.getMaxTime(date)}
          onDateChange={this.onDateChange}
          use12Hours
          {...timePickerProps}
        />
      </div>
    );
  }
}
