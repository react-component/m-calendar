import { Models } from './date/DataTypes';

export { default as Calendar, ExtraData, PropsType as CalendarPropsType } from './Calendar';
export { default as DatePicker, PropsType as DatePickerPropsType } from './DatePicker';

import zhCN from './locale/zh_CN';
import enUS from './locale/en_US';
import deDE from './locale/de_DE';
const Locale = { zhCN, enUS, deDE };

type LocaleType = Models.Locale;
export { Locale, LocaleType };
