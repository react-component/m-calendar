import React from 'react';
import { render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { Calendar, Locale } from '../src';

describe('Calendar', () => {
    it('base.', () => {
        const wrapper = render(
            <Calendar
            />
        );
        expect(renderToJson(wrapper)).toMatchSnapshot();
    });

    it('show shortcut.', () => {
        const wrapper = render(
            <Calendar
                visible={true}
                showShortcut={true}
            />
        );
        expect(renderToJson(wrapper)).toMatchSnapshot();
    });
});

describe('Calendar english.', () => {
    it('renders correctly', () => {
        const wrapper = render(
            <Calendar
                visible={true}
                locale={Locale.enUS}
            />
        );
        expect(renderToJson(wrapper)).toMatchSnapshot();
    });
});