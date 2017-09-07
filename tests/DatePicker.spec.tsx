import React from 'react';
import { render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { DatePicker } from '../src';

describe('DatePicker', () => {
  it('renders correctly', () => {
    const wrapper = render(
      <DatePicker
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
});
