import React from 'react';
import Adapter from 'enzyme-adapter-react-15';
import { default as Enzyme, render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { DatePicker } from '../src';

Enzyme.configure({ adapter: new Adapter() });

describe('DatePicker', () => {
  it('renders correctly', () => {
    const wrapper = render(
      <DatePicker
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
});
