import React from 'react';
import Adapter from 'enzyme-adapter-react-15';
import { default as Enzyme, render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { Calendar, Locale } from '../src';

Enzyme.configure({ adapter: new Adapter() });

describe('Calendar', () => {
  it('base.', () => {
    const wrapper = render(
      <Calendar
        defaultDate={new Date(2017, 7, 15)}
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('show shortcut.', () => {
    const wrapper = render(
      <Calendar
        defaultDate={new Date(2017, 7, 15)}
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
        defaultDate={new Date(2017, 7, 15)}
        visible={true}
        locale={Locale.enUS}
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
});
