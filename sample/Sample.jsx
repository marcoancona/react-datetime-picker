import React, { Component } from 'react';
import { render } from 'react-dom';
import DateTimePicker from 'react-datetime-picker';

import './Sample.less';

export default class Sample extends Component {
  state = {
    value: new Date(),
    focusOn: 'month',
  }

  inputRef = React.createRef()

  onChange = value => {
    this.setState({ value })
  }

  componentDidMount() {
    this.inputRef.current.focusOn('month')
  }

  render() {
    const { value } = this.state;

    return (
      <div className="Sample">
        <header>
          <h1>react-datetime-picker sample page</h1>
        </header>
        <div className="Sample__container">
          <main className="Sample__container__content">
            <DateTimePicker
              ref={this.inputRef}
              onChange={this.onChange}
              value={value}
              minDate={new Date()}
              stepMinute={5}
              onNextNavigation={() => this.inputRef.current.focusOn('first')}
              onPrevNavigation={() => this.inputRef.current.focusOn('last')}
            />
          </main>
        </div>
      </div>
    );
  }
}

render(<Sample />, document.getElementById('react-container'));
