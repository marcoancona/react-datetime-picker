import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import DayInput from 'react-date-picker/dist/DateInput/DayInput';
import MonthInput from 'react-date-picker/dist/DateInput/MonthInput';
import YearInput from 'react-date-picker/dist/DateInput/YearInput';
import Hour12Input from 'react-time-picker/dist/TimeInput/Hour12Input';
import Hour24Input from 'react-time-picker/dist/TimeInput/Hour24Input';
import MinuteInput from 'react-time-picker/dist/TimeInput/MinuteInput';
import SecondInput from 'react-time-picker/dist/TimeInput/SecondInput';
import AmPm from 'react-time-picker/dist/TimeInput/AmPm';
import Divider from './Divider';
import NativeInput from './DateTimeInput/NativeInput';

import { formatDate, formatTime } from './shared/dateFormatter';
import {
  getDay,
  getHours,
  getMinutes,
  getMonth,
  getSeconds,
  getYear,
  getHoursMinutesSeconds,
  convert12to24,
  convert24to12,
} from './shared/dates';
import { isMaxDate, isMinDate } from './shared/propTypes';

const defaultMinDate = new Date(-8.64e15);
const defaultMaxDate = new Date(8.64e15);
const allViews = ['hour', 'minute', 'second'];

const datesAreDifferent = (date1, date2) => (
  (date1 && !date2)
  || (!date1 && date2)
  || (date1 && date2 && date1.getTime() !== date2.getTime())
);

const findPreviousInput = (element) => {
  const previousElement = element.previousElementSibling; // Divider between inputs
  if (!previousElement) {
    return null;
  }
  return previousElement.previousElementSibling; // Actual input
};

const findNextInput = (element) => {
  const nextElement = element.nextElementSibling; // Divider between inputs
  if (!nextElement) {
    return null;
  }
  return nextElement.nextElementSibling; // Actual input
};

const focus = element => element && element.focus();

const removeUnwantedCharacters = str => str
  .replace(/[年月日]/g, '/')
  .split('')
  .filter(a => (
    // We don't want spaces in dates
    a.charCodeAt(0) !== 32
    // Internet Explorer specific
    && a.charCodeAt(0) !== 8206
    // Remove non-ASCII characters
    && /^[\x20-\x7F]*$/.test(a)
  ))
  .join('');

export default class DateTimeInput extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    const nextState = {};

    /**
     * If isWidgetOpen flag has changed, we have to update it.
     * It's saved in state purely for use in getDerivedStateFromProps.
     */
    if (nextProps.isWidgetOpen !== prevState.isWidgetOpen) {
      nextState.isWidgetOpen = nextProps.isWidgetOpen;
    }

    /**
     * If the next value is different from the current one  (with an exception of situation in
     * which values provided are limited by minDate and maxDate so that the dates are the same),
     * get a new one.
     */
    const nextValue = nextProps.value;
    if (
      // Toggling calendar visibility resets values
      nextState.isCalendarOpen // Flag was toggled
      || datesAreDifferent(nextValue, prevState.value)
    ) {
      if (nextValue) {
        [, nextState.amPm] = convert24to12(getHours(nextValue));
        nextState.year = getYear(nextValue);
        nextState.month = getMonth(nextValue);
        nextState.day = getDay(nextValue);
        nextState.hour = getHours(nextValue);
        nextState.minute = getMinutes(nextValue);
        nextState.second = getSeconds(nextValue);
      } else {
        nextState.amPm = null;
        nextState.year = null;
        nextState.month = null;
        nextState.day = null;
        nextState.hour = null;
        nextState.minute = null;
        nextState.second = null;
      }
      nextState.value = nextValue;
    }

    nextState.minDateTimeString = '0000-01-01T00:00:00';
    if (nextProps.minDate) {
      if (nextProps.minDate instanceof Date) {
        const year = `000${nextProps.minDate.getFullYear()}`.slice(-4);
        const month = `0${nextProps.minDate.getMonth() + 1}`.slice(-2);
        const day = `0${nextProps.minDate.getDate()}`.slice(-2);
        const hour = `0${nextProps.minDate.getHours()}`.slice(-2);
        const minute = `0${nextProps.minDate.getMinutes()}`.slice(-2);
        const second = `0${nextProps.minDate.getSeconds()}`.slice(-2);
        nextState.minDateTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
      }
      else {
        nextState.minDateTimeString = nextProps.minDate;
      }
    }

    nextState.maxDateTimeString = '9999-31-12T23:59:59';
    if (nextProps.maxDate) {
      if (nextProps.maxDate instanceof Date) {
        const year = `000${nextProps.maxDate.getFullYear()}`.slice(-4);
        const month = `0${nextProps.maxDate.getMonth() + 1}`.slice(-2);
        const day = `0${nextProps.maxDate.getDate()}`.slice(-2);
        const hour = `0${nextProps.maxDate.getHours()}`.slice(-2);
        const minute = `0${nextProps.maxDate.getMinutes()}`.slice(-2);
        const second = `0${nextProps.maxDate.getSeconds()}`.slice(-2);
        nextState.maxDateTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
      }
      else {
        nextState.maxDateTimeString = nextProps.maxDate;
      }
    }

    return nextState;
  }

  state = {
    amPm: null,
    year: null,
    month: null,
    day: null,
    hour: null,
    minute: null,
    second: null,
  };

  /**
   * Gets current value in a desired format.
   */
  getProcessedValue(value) {
    if (!value) {
      return null;
    }
    const [valueDate, valueTime] = value.split('T');

    const [yearString, monthString, dayString] = valueDate.split('-');
    const year = parseInt(yearString, 10);
    const monthIndex = parseInt(monthString, 10) - 1 || 0;
    const date = parseInt(dayString, 10) || 1;

    const [hourString, minuteString, secondString] = valueTime.split(':');
    const hour = parseInt(hourString, 10) || 0;
    const minute = parseInt(minuteString, 10) || 0;
    const second = parseInt(secondString, 10) || 0;

    return new Date(year, monthIndex, date, hour, minute, second);
  }

  // eslint-disable-next-line class-methods-use-this
  get dateDivider() {
    const { locale } = this.props;
    const date = new Date(2017, 11, 11);

    return (
      removeUnwantedCharacters(formatDate(date, locale))
        .match(/[^0-9]/)[0]
    );
  }

  // eslint-disable-next-line class-methods-use-this
  get timeDivider() {
    const { locale } = this.props;
    const date = new Date(2017, 0, 1, 21, 12, 13);

    return (
      removeUnwantedCharacters(formatTime(date, locale))
        .match(/[^0-9]/)[0]
    );
  }

  // eslint-disable-next-line class-methods-use-this
  get datePlaceholder() {
    const { locale } = this.props;
    const date = new Date(2017, 11, 11);

    return (
      removeUnwantedCharacters(formatDate(date, locale))
        .replace('2017', 'year')
        .replace('12', 'month')
        .replace('11', 'day')
    );
  }

  // eslint-disable-next-line class-methods-use-this
  get timePlaceholder() {
    const { locale } = this.props;
    const date = new Date(2017, 0, 1, 21, 13, 14);

    return (
      removeUnwantedCharacters(formatTime(date, locale))
        .replace('21', 'hour-24')
        .replace('9', 'hour-12')
        .replace('13', 'minute')
        .replace('14', 'second')
        .replace(/AM|PM/i, `${this.timeDivider}ampm`)
    );
  }

  get maxTime() {
    const { maxDate } = this.props;

    if (!maxDate) {
      return null;
    }

    const { year, month, day } = this.state;

    if (
      getYear(maxDate) !== year
      || getMonth(maxDate) !== month
      || getDay(maxDate) !== day
    ) {
      return null;
    }

    return getHoursMinutesSeconds(maxDate);
  }

  get minTime() {
    const { minDate } = this.props;

    if (!minDate) {
      return null;
    }

    const { year, month, day } = this.state;

    if (
      getYear(minDate) !== year
      || getMonth(minDate) !== month
      || getDay(minDate) !== day
    ) {
      return null;
    }

    return getHoursMinutesSeconds(minDate);
  }

  get commonInputProps() {
    const {
      className,
      disabled,
      isWidgetOpen,
      required,
    } = this.props;

    return {
      className,
      disabled,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      placeholder: '--',
      // This is only for showing validity when editing
      required: required || isWidgetOpen,
      itemRef: (ref, name) => {
        // Save a reference to each input field
        this[`${name}Input`] = ref;
      },
    };
  }

  /**
   * Returns value type that can be returned with currently applied settings.
   */
  get valueType() {
    const { maxDetail } = this.props;

    return maxDetail;
  }


  isValidDateTime = (dateTimeString) => {
    const { minDateTimeString, maxDateTimeString } = this.state;
    return (Date.parse(dateTimeString) && dateTimeString >= minDateTimeString && dateTimeString <= maxDateTimeString);
  }

  onKeyDown = (event) => {
    let offset = null;
    switch (event.key) {
      case 'ArrowUp': {
        offset = 1;
      }
      case 'ArrowDown': {
        event.preventDefault();
        if (!offset) offset = -1;
        const key = event.target.name;
        const { year, month, day, hour, minute, second } = this.state;
        let yearString = `000${year}`.slice(-4);
        let monthString = `0${month}`.slice(-2);
        let dayString = `0${day}`.slice(-2);
        let hourString = `0${hour}`.slice(-2);
        let minuteString = `0${minute}`.slice(-2);
        let secondString = `0${second}`.slice(-2);
        const nextValue = new Date(`${yearString}-${monthString}-${dayString}T${hourString}:${minuteString}:${secondString}`);

        if (key === 'day') {
          nextValue.setDate(nextValue.getDate() + offset);
        }
        else if (key === 'month') {
          nextValue.setMonth(nextValue.getMonth() + offset);
        }
        else if (key === 'year') {
          nextValue.setFullYear(nextValue.getFullYear() + offset);
        }
        else if (key === 'second') {
          nextValue.setSeconds(nextValue.getSeconds() + offset);
        }
        else if (key === 'minute') {
          nextValue.setMinutes(nextValue.getMinutes() + offset);
        }
        else if (key === 'hour12' || key === 'hour24') {
          nextValue.setHours(nextValue.getHours() + offset);
        }
        yearString = `${nextValue.getFullYear()}`;
        monthString = `0${nextValue.getMonth() + 1}`.slice(-2);
        dayString = `0${nextValue.getDate()}`.slice(-2);
        hourString = `0${nextValue.getHours()}`.slice(-2);
        minuteString = `0${nextValue.getMinutes()}`.slice(-2);
        secondString = `0${nextValue.getSeconds()}`.slice(-2);
        const timeString = `${yearString}-${monthString}-${dayString}T${hourString}:${minuteString}:${secondString}`;
        this.onChangeKeyEvent(timeString);
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();

        const input = event.target;
        const previousInput = findPreviousInput(input);
        focus(previousInput);
        break;
      }
      case 'ArrowRight':
      case this.dateDivider:
      case this.timeDivider: {
        event.preventDefault();

        const input = event.target;
        const nextInput = findNextInput(input);
        focus(nextInput);
        break;
      }
      default:
    }
  }

  /**
   * Called when non-native date input is changed.
   */
  onChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case 'hour12': {
        this.setState(
          prevState => ({
            hour: value ? convert12to24(parseInt(value, 10), prevState.amPm) : null,
          }),
          this.onChangeExternal,
        );
        break;
      }
      case 'hour24': {
        this.setState(
          { hour: value ? parseInt(value, 10) : null },
          this.onChangeExternal,
        );
        break;
      }
      default: {
        this.setState(
          { [name]: value ? parseInt(value, 10) : null },
          this.onChangeExternal,
        );
      }
    }
  }

  /**
   * Called when native date input is changed.
   */
  onChangeNative = (event) => {
    const { onChange } = this.props;
    const { value } = event.target;

    if (!onChange) {
      return;
    }

    const processedValue = this.getProcessedValue(value);

    onChange(processedValue, false);
  }

  onChangeAmPm = (event) => {
    const { value } = event.target;

    this.setState(
      ({ amPm: value }),
      this.onChangeExternal,
    );
  }

  onChangeKeyEvent = (proposedValue) => {
    const { onChange } = this.props;

    if (!onChange || !this.isValidDateTime(proposedValue)) {
      return;
    }
    const processedValue = this.getProcessedValue(proposedValue);
    return onChange(processedValue, false);
  }

  /**
   * Called after internal onChange. Checks input validity. If all fields are valid,
   * calls props.onChange.
   */
  onChangeExternal = () => {
    const { onChange } = this.props;

    if (!onChange) {
      return;
    }

    const formElements = [
      this.dayInput,
      this.monthInput,
      this.yearInput,
      this.hour12Input,
      this.hour24Input,
      this.minuteInput,
      this.secondInput,
      this.amPmInput,
    ].filter(Boolean);

    const formElementsWithoutSelect = formElements.slice(0, -1);
    const activeElement = formElementsWithoutSelect.find(el => document.activeElement === el);

    const values = {};
    formElements.forEach((formElement) => {
      values[formElement.name] = formElement.value;
    });

    if (formElementsWithoutSelect.every(formElement => !formElement.value)) {
      onChange(null, false);
    } else {
      const year = `000${values.year || 0}`.slice(-4);
      const month = `0${values.month || 1}`.slice(-2);
      const day = `0${values.day || 1}`.slice(-2);
      const hour = `0${values.hour24 || convert12to24(values.hour12, values.amPm)}`.slice(-2);
      const minute = `0${values.minute || 0}`.slice(-2);
      const second = `0${values.second || 0}`.slice(-2);
      const dateTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
      if (this.isValidDateTime(dateTimeString)) {
        formElementsWithoutSelect.forEach(el => el.setCustomValidity(''));
        const processedValue = this.getProcessedValue(dateTimeString);
        onChange(processedValue, false);
      }
      else if (activeElement) {
        activeElement.setCustomValidity('Invalid date');
      }
      else {
        formElementsWithoutSelect.forEach(el => el.setCustomValidity('Invalid range'));
      }
    }
  }

  renderDay() {
    const { maxDetail, showLeadingZeros } = this.props;
    const { day, month, year } = this.state;

    return (
      <DayInput
        key="day"
        {...this.commonInputProps}
        maxDetail={maxDetail}
        month={month}
        showLeadingZeros={showLeadingZeros}
        year={year}
        value={day}
      />
    );
  }

  renderMonth() {
    const { maxDetail, showLeadingZeros } = this.props;
    const { month } = this.state;

    return (
      <MonthInput
        key="month"
        {...this.commonInputProps}
        maxDetail={maxDetail}
        showLeadingZeros={showLeadingZeros}
        value={month}
      />
    );
  }

  renderYear() {
    const { year } = this.state;

    return (
      <YearInput
        key="year"
        {...this.commonInputProps}
        value={year}
        valueType="day"
      />
    );
  }

  renderHour12() {
    const { hour } = this.state;

    return (
      <Hour12Input
        key="hour12"
        {...this.commonInputProps}
        value={hour}
      />
    );
  }

  renderHour24() {
    const { hour } = this.state;

    return (
      <Hour24Input
        key="hour24"
        {...this.commonInputProps}
        value={hour}
      />
    );
  }

  renderMinute() {
    const { maxDetail } = this.props;

    // Do not display if maxDetail is "hour" or less
    if (allViews.indexOf(maxDetail) < 1) {
      return null;
    }

    const { hour, minute } = this.state;

    return (
      <MinuteInput
        key="minute"
        {...this.commonInputProps}
        hour={hour}
        maxDetail={maxDetail}
        value={minute}
      />
    );
  }

  renderSecond() {
    const { maxDetail } = this.props;

    // Do not display if maxDetail is "minute" or less
    if (allViews.indexOf(maxDetail) < 2) {
      return null;
    }

    const { hour, minute, second } = this.state;

    return (
      <SecondInput
        key="second"
        {...this.commonInputProps}
        hour={hour}
        maxDetail={maxDetail}
        minute={minute}
        value={second}
      />
    );
  }

  renderAmPm() {
    const { amPm } = this.state;

    return (
      <AmPm
        key="ampm"
        {...this.commonInputProps}
        value={amPm}
        onChange={this.onChangeAmPm}
      />
    );
  }

  renderCustomDateInputs() {
    const { dateDivider, datePlaceholder } = this;

    return (
      datePlaceholder
        .split(dateDivider)
        .map((part) => {
          switch (part) {
            case 'day': return this.renderDay();
            case 'month': return this.renderMonth();
            case 'year': return this.renderYear();
            default: return null;
          }
        })
        .filter(Boolean)
        .reduce((result, element, index) => {
          if (index) {
            result.push(
              // eslint-disable-next-line react/no-array-index-key
              <Divider key={`separator_${index}`}>
                {dateDivider}
              </Divider>,
            );
          }

          result.push(element);

          return result;
        }, [])
    );
  }

  renderCustomTimeInputs() {
    const { timeDivider, timePlaceholder } = this;

    return (
      timePlaceholder
        .split(timeDivider)
        .map((part) => {
          switch (part) {
            case 'hour-12': return this.renderHour12();
            case 'hour-24': return this.renderHour24();
            case 'minute': return this.renderMinute();
            case 'second': return this.renderSecond();
            case 'ampm': return this.renderAmPm();
            default: return null;
          }
        })
        .filter(Boolean)
        .reduce((result, element, index) => {
          if (index && element.key !== 'ampm') {
            result.push(
              // eslint-disable-next-line react/no-array-index-key
              <Divider key={`separator_${index}`}>
                {timeDivider}
              </Divider>,
            );
          }

          result.push(element);

          return result;
        }, [])
    );
  }

  renderNativeInput() {
    const {
      disabled,
      maxDate,
      minDate,
      name,
      required,
      value,
    } = this.props;

    return (
      <NativeInput
        key="time"
        disabled={disabled}
        maxDate={maxDate || defaultMaxDate}
        minDate={minDate || defaultMinDate}
        name={name}
        onChange={this.onChangeNative}
        required={required}
        value={value}
        valueType={this.valueType}
      />
    );
  }

  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        {this.renderNativeInput()}
        {this.renderCustomDateInputs()}
        <Divider>
          {'\u00a0'}
        </Divider>
        {this.renderCustomTimeInputs()}
      </div>
    );
  }
}

DateTimeInput.defaultProps = {
  maxDetail: 'minute',
  name: 'datetime',
};

DateTimeInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isWidgetOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  maxDetail: PropTypes.oneOf(allViews),
  minDate: isMinDate,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
};

polyfill(DateTimeInput);
