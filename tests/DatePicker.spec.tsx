import * as React from 'react';
import Adapter from 'enzyme-adapter-react-15';
import * as Enzyme from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { DatePicker } from '../src';

Enzyme.configure({ adapter: new Adapter() });

describe('DatePicker', () => {
  it('renders correctly', () => {
    const wrapper = Enzyme.render(
      <DatePicker
        defaultDate={new Date(2017, 7, 15)}
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
});
