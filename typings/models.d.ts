declare module 'rc-animate';
declare module 'zscroller/lib/DOMScroller';

declare namespace GlobalModels {

    interface Locale {
        title: string,
        today: string,
        month: string,
        year: string,
        am: string,
        pm: string,
        dateFormat: string,
        dateTimeFormat: string,
        noChoose: string,
        week: string[],
        clear: string,
        selectTime: string,
        selectStartTime: string,
        selectEndTime: string,
        start: string,
        end: string,
        begin: string,
        over: string,
        begin_over: string,
        confirm: string,
        monthTitle: string,
        loadPrevMonth: string,
        yesterday: string,
        lastWeek: string,
        lastMonth: string,
    }
}