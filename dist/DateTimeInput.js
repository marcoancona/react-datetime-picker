'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _DayInput = require('react-date-picker/dist/DateInput/DayInput');

var _DayInput2 = _interopRequireDefault(_DayInput);

var _MonthInput = require('react-date-picker/dist/DateInput/MonthInput');

var _MonthInput2 = _interopRequireDefault(_MonthInput);

var _YearInput = require('react-date-picker/dist/DateInput/YearInput');

var _YearInput2 = _interopRequireDefault(_YearInput);

var _Hour12Input = require('react-time-picker/dist/TimeInput/Hour12Input');

var _Hour12Input2 = _interopRequireDefault(_Hour12Input);

var _Hour24Input = require('react-time-picker/dist/TimeInput/Hour24Input');

var _Hour24Input2 = _interopRequireDefault(_Hour24Input);

var _MinuteInput = require('react-time-picker/dist/TimeInput/MinuteInput');

var _MinuteInput2 = _interopRequireDefault(_MinuteInput);

var _SecondInput = require('react-time-picker/dist/TimeInput/SecondInput');

var _SecondInput2 = _interopRequireDefault(_SecondInput);

var _AmPm = require('react-time-picker/dist/TimeInput/AmPm');

var _AmPm2 = _interopRequireDefault(_AmPm);

var _Divider = require('./Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _NativeInput = require('./DateTimeInput/NativeInput');

var _NativeInput2 = _interopRequireDefault(_NativeInput);

var _dateFormatter = require('./shared/dateFormatter');

var _dates = require('./shared/dates');

var _propTypes3 = require('./shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultMinDate = new Date(-8.64e15);
var defaultMaxDate = new Date(8.64e15);
var allViews = ['hour', 'minute', 'second'];

var datesAreDifferent = function datesAreDifferent(date1, date2) {
  return date1 && !date2 || !date1 && date2 || date1 && date2 && date1.getTime() !== date2.getTime();
};

var findPreviousInput = function findPreviousInput(element) {
  var previousElement = element.previousElementSibling; // Divider between inputs
  if (!previousElement) {
    return null;
  }
  return previousElement.previousElementSibling; // Actual input
};

var findNextInput = function findNextInput(element) {
  var nextElement = element.nextElementSibling; // Divider between inputs
  if (!nextElement) {
    return null;
  }
  return nextElement.nextElementSibling; // Actual input
};

var focus = function focus(element) {
  return element && element.focus();
};

var removeUnwantedCharacters = function removeUnwantedCharacters(str) {
  return str.replace(/[年月日]/g, '/').split('').filter(function (a) {
    return (
      // We don't want spaces in dates
      a.charCodeAt(0) !== 32
      // Internet Explorer specific
      && a.charCodeAt(0) !== 8206
      // Remove non-ASCII characters
      && /^[\x20-\x7F]*$/.test(a)
    );
  }).join('');
};

var DateTimeInput = function (_PureComponent) {
  _inherits(DateTimeInput, _PureComponent);

  function DateTimeInput() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DateTimeInput);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DateTimeInput.__proto__ || Object.getPrototypeOf(DateTimeInput)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      amPm: null,
      year: null,
      month: null,
      day: null,
      hour: null,
      minute: null,
      second: null
    }, _this.isValidDateTime = function (dateTimeString) {
      var _this$state = _this.state,
          minDateTimeString = _this$state.minDateTimeString,
          maxDateTimeString = _this$state.maxDateTimeString;

      var formElements = [_this.dayInput, _this.monthInput, _this.yearInput, _this.hour12Input, _this.hour24Input, _this.minuteInput, _this.secondInput, _this.amPmInput].filter(Boolean);

      var formElementsWithoutSelect = formElements.slice(0, -1);
      var isValid = Date.parse(dateTimeString) && dateTimeString >= minDateTimeString && dateTimeString <= maxDateTimeString;
      if (isValid) {
        formElementsWithoutSelect.forEach(function (el) {
          return el.setCustomValidity('');
        });
        return true;
      } else {
        formElementsWithoutSelect.forEach(function (el) {
          return el.setCustomValidity('Invalid range');
        });
        return false;
      }
    }, _this.onKeyDown = function (event) {
      var offset = null;
      switch (event.key) {
        case 'ArrowUp':
          {
            offset = 1;
          }
        case 'ArrowDown':
          {
            event.preventDefault();
            if (!offset) offset = -1;
            var key = event.target.name;
            var _this$state2 = _this.state,
                year = _this$state2.year,
                month = _this$state2.month,
                day = _this$state2.day,
                hour = _this$state2.hour,
                minute = _this$state2.minute,
                second = _this$state2.second;
            var stepMinute = _this.props.stepMinute;

            var yearString = ('000' + year).slice(-4);
            var monthString = ('0' + month).slice(-2);
            var dayString = ('0' + day).slice(-2);
            var hourString = ('0' + hour).slice(-2);
            var minuteString = ('0' + minute).slice(-2);
            var secondString = ('0' + second).slice(-2);
            var nextValue = new Date(yearString + '-' + monthString + '-' + dayString + 'T' + hourString + ':' + minuteString + ':' + secondString);

            if (key === 'day') {
              nextValue.setDate(nextValue.getDate() + offset);
            } else if (key === 'month') {
              nextValue.setMonth(nextValue.getMonth() + offset);
            } else if (key === 'year') {
              nextValue.setFullYear(nextValue.getFullYear() + offset);
            } else if (key === 'second') {
              nextValue.setSeconds(nextValue.getSeconds() + offset);
            } else if (key === 'minute') {
              var value = nextValue.getMinutes() + offset * stepMinute;
              // Now round to next `step` interval (eg. 31 to 35, 57 to 00)
              if (stepMinute > 1) {
                value = Math.floor(value / stepMinute) * stepMinute;
              }
              nextValue.setMinutes(value);
            } else if (key === 'hour12' || key === 'hour24') {
              nextValue.setHours(nextValue.getHours() + offset);
            }
            yearString = '' + nextValue.getFullYear();
            monthString = ('0' + (nextValue.getMonth() + 1)).slice(-2);
            dayString = ('0' + nextValue.getDate()).slice(-2);
            hourString = ('0' + nextValue.getHours()).slice(-2);
            minuteString = ('0' + nextValue.getMinutes()).slice(-2);
            secondString = ('0' + nextValue.getSeconds()).slice(-2);
            var timeString = yearString + '-' + monthString + '-' + dayString + 'T' + hourString + ':' + minuteString + ':' + secondString;
            _this.onChangeKeyEvent(timeString);
            break;
          }
        case 'ArrowLeft':
          {
            event.preventDefault();
            var onPrevNavigation = _this.props.onPrevNavigation;

            var input = event.target;
            var previousInput = findPreviousInput(input);
            focus(previousInput);
            if (!previousInput && onPrevNavigation) onPrevNavigation();
            break;
          }
        case 'Tab':
        case 'ArrowRight':
        case _this.dateDivider:
        case _this.timeDivider:
          {
            event.preventDefault();
            var onNextNavigation = _this.props.onNextNavigation;

            var _input = event.target;
            var nextInput = findNextInput(_input);
            focus(nextInput);
            if (!nextInput && onNextNavigation) onNextNavigation();
            break;
          }
        default:
      }
    }, _this.onChange = function (event) {
      var _event$target = event.target,
          name = _event$target.name,
          value = _event$target.value;


      switch (name) {
        case 'hour12':
          {
            _this.setState(function (prevState) {
              return {
                hour: value ? (0, _dates.convert12to24)(parseInt(value, 10), prevState.amPm) : null
              };
            }, _this.onChangeExternal);
            break;
          }
        case 'hour24':
          {
            _this.setState({ hour: value ? parseInt(value, 10) : null }, _this.onChangeExternal);
            break;
          }
        default:
          {
            _this.setState(_defineProperty({}, name, value ? parseInt(value, 10) : null), _this.onChangeExternal);
          }
      }
    }, _this.onChangeNative = function (event) {
      var onChange = _this.props.onChange;
      var value = event.target.value;


      if (!onChange) {
        return;
      }

      var processedValue = _this.getProcessedValue(value);

      onChange(processedValue, false);
    }, _this.onChangeAmPm = function (event) {
      var value = event.target.value;


      _this.setState({ amPm: value }, _this.onChangeExternal);
    }, _this.onChangeKeyEvent = function (proposedValue) {
      var onChange = _this.props.onChange;


      if (!onChange || !_this.isValidDateTime(proposedValue)) {
        return;
      }
      var processedValue = _this.getProcessedValue(proposedValue);
      onChange(processedValue, false);
    }, _this.onChangeExternal = function () {
      var onChange = _this.props.onChange;


      if (!onChange) {
        return;
      }

      var formElements = [_this.dayInput, _this.monthInput, _this.yearInput, _this.hour12Input, _this.hour24Input, _this.minuteInput, _this.secondInput, _this.amPmInput].filter(Boolean);

      var formElementsWithoutSelect = formElements.slice(0, -1);

      var values = {};
      formElements.forEach(function (formElement) {
        values[formElement.name] = formElement.value;
      });

      if (formElementsWithoutSelect.every(function (formElement) {
        return !formElement.value;
      })) {
        onChange(null, false);
      } else {
        var year = ('000' + (values.year || 0)).slice(-4);
        var month = ('0' + (values.month || 1)).slice(-2);
        var day = ('0' + (values.day || 1)).slice(-2);
        var hour = ('0' + (values.hour24 || (0, _dates.convert12to24)(values.hour12, values.amPm))).slice(-2);
        var minute = ('0' + (values.minute || 0)).slice(-2);
        var second = ('0' + (values.second || 0)).slice(-2);
        var dateTimeString = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second;
        if (_this.isValidDateTime(dateTimeString)) {
          var processedValue = _this.getProcessedValue(dateTimeString);
          onChange(processedValue, false);
        } else {
          formElementsWithoutSelect.forEach(function (el) {
            return el.setCustomValidity('Invalid range');
          });
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DateTimeInput, [{
    key: 'focusOn',
    value: function focusOn(elName) {
      var _this2 = this;

      if (elName === 'first' || elName === 'last') {
        var allInputs = ['yearInput', 'monthInput', 'dayInput', 'hourInput', 'minuteInput', 'secondInput'];
        var elementName = allInputs.find(function (el) {
          return !!_this2[el];
        });
        if (elementName) {
          var inputEl = this[elementName];
          var findSibling = elName === 'first' ? findPreviousInput : findNextInput;
          while (findSibling(inputEl)) {
            inputEl = findSibling(inputEl);
          }
          focus(inputEl);
        }
      } else {
        focus(this[elName + 'Input']);
      }
    }
  }, {
    key: 'getProcessedValue',


    /**
     * Gets current value in a desired format.
     */
    value: function getProcessedValue(value) {
      if (!value) {
        return null;
      }

      var _value$split = value.split('T'),
          _value$split2 = _slicedToArray(_value$split, 2),
          valueDate = _value$split2[0],
          valueTime = _value$split2[1];

      var _valueDate$split = valueDate.split('-'),
          _valueDate$split2 = _slicedToArray(_valueDate$split, 3),
          yearString = _valueDate$split2[0],
          monthString = _valueDate$split2[1],
          dayString = _valueDate$split2[2];

      var year = parseInt(yearString, 10);
      var monthIndex = parseInt(monthString, 10) - 1 || 0;
      var date = parseInt(dayString, 10) || 1;

      var _valueTime$split = valueTime.split(':'),
          _valueTime$split2 = _slicedToArray(_valueTime$split, 3),
          hourString = _valueTime$split2[0],
          minuteString = _valueTime$split2[1],
          secondString = _valueTime$split2[2];

      var hour = parseInt(hourString, 10) || 0;
      var minute = parseInt(minuteString, 10) || 0;
      var second = parseInt(secondString, 10) || 0;

      return new Date(year, monthIndex, date, hour, minute, second);
    }

    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'renderDay',
    value: function renderDay() {
      var _props = this.props,
          maxDetail = _props.maxDetail,
          showLeadingZeros = _props.showLeadingZeros;
      var _state = this.state,
          day = _state.day,
          month = _state.month,
          year = _state.year;


      return _react2.default.createElement(_DayInput2.default, _extends({
        key: 'day'
      }, this.commonInputProps, {
        maxDetail: maxDetail,
        month: month,
        showLeadingZeros: showLeadingZeros,
        year: year,
        value: day
      }));
    }
  }, {
    key: 'renderMonth',
    value: function renderMonth() {
      var _props2 = this.props,
          maxDetail = _props2.maxDetail,
          showLeadingZeros = _props2.showLeadingZeros;
      var month = this.state.month;


      return _react2.default.createElement(_MonthInput2.default, _extends({
        key: 'month'
      }, this.commonInputProps, {
        maxDetail: maxDetail,
        showLeadingZeros: showLeadingZeros,
        value: month
      }));
    }
  }, {
    key: 'renderYear',
    value: function renderYear() {
      var year = this.state.year;


      return _react2.default.createElement(_YearInput2.default, _extends({
        key: 'year'
      }, this.commonInputProps, {
        value: year,
        valueType: 'day'
      }));
    }
  }, {
    key: 'renderHour12',
    value: function renderHour12() {
      var hour = this.state.hour;


      return _react2.default.createElement(_Hour12Input2.default, _extends({
        key: 'hour12'
      }, this.commonInputProps, {
        value: hour
      }));
    }
  }, {
    key: 'renderHour24',
    value: function renderHour24() {
      var hour = this.state.hour;


      return _react2.default.createElement(_Hour24Input2.default, _extends({
        key: 'hour24'
      }, this.commonInputProps, {
        value: hour
      }));
    }
  }, {
    key: 'renderMinute',
    value: function renderMinute() {
      var maxDetail = this.props.maxDetail;

      // Do not display if maxDetail is "hour" or less

      if (allViews.indexOf(maxDetail) < 1) {
        return null;
      }

      var _state2 = this.state,
          hour = _state2.hour,
          minute = _state2.minute;


      return _react2.default.createElement(_MinuteInput2.default, _extends({
        key: 'minute'
      }, this.commonInputProps, {
        hour: hour,
        maxDetail: maxDetail,
        value: minute
      }));
    }
  }, {
    key: 'renderSecond',
    value: function renderSecond() {
      var maxDetail = this.props.maxDetail;

      // Do not display if maxDetail is "minute" or less

      if (allViews.indexOf(maxDetail) < 2) {
        return null;
      }

      var _state3 = this.state,
          hour = _state3.hour,
          minute = _state3.minute,
          second = _state3.second;


      return _react2.default.createElement(_SecondInput2.default, _extends({
        key: 'second'
      }, this.commonInputProps, {
        hour: hour,
        maxDetail: maxDetail,
        minute: minute,
        value: second
      }));
    }
  }, {
    key: 'renderAmPm',
    value: function renderAmPm() {
      var amPm = this.state.amPm;


      return _react2.default.createElement(_AmPm2.default, _extends({
        key: 'ampm'
      }, this.commonInputProps, {
        value: amPm,
        onChange: this.onChangeAmPm
      }));
    }
  }, {
    key: 'renderCustomDateInputs',
    value: function renderCustomDateInputs() {
      var _this3 = this;

      var dateDivider = this.dateDivider,
          datePlaceholder = this.datePlaceholder;


      return datePlaceholder.split(dateDivider).map(function (part) {
        switch (part) {
          case 'day':
            return _this3.renderDay();
          case 'month':
            return _this3.renderMonth();
          case 'year':
            return _this3.renderYear();
          default:
            return null;
        }
      }).filter(Boolean).reduce(function (result, element, index) {
        if (index) {
          result.push(
          // eslint-disable-next-line react/no-array-index-key
          _react2.default.createElement(
            _Divider2.default,
            { key: 'separator_' + index },
            dateDivider
          ));
        }

        result.push(element);

        return result;
      }, []);
    }
  }, {
    key: 'renderCustomTimeInputs',
    value: function renderCustomTimeInputs() {
      var _this4 = this;

      var timeDivider = this.timeDivider,
          timePlaceholder = this.timePlaceholder;


      return timePlaceholder.split(timeDivider).map(function (part) {
        switch (part) {
          case 'hour-12':
            return _this4.renderHour12();
          case 'hour-24':
            return _this4.renderHour24();
          case 'minute':
            return _this4.renderMinute();
          case 'second':
            return _this4.renderSecond();
          case 'ampm':
            return _this4.renderAmPm();
          default:
            return null;
        }
      }).filter(Boolean).reduce(function (result, element, index) {
        if (index && element.key !== 'ampm') {
          result.push(
          // eslint-disable-next-line react/no-array-index-key
          _react2.default.createElement(
            _Divider2.default,
            { key: 'separator_' + index },
            timeDivider
          ));
        }

        result.push(element);

        return result;
      }, []);
    }
  }, {
    key: 'renderNativeInput',
    value: function renderNativeInput() {
      var _props3 = this.props,
          disabled = _props3.disabled,
          maxDate = _props3.maxDate,
          minDate = _props3.minDate,
          name = _props3.name,
          required = _props3.required,
          value = _props3.value;


      return _react2.default.createElement(_NativeInput2.default, {
        key: 'time',
        disabled: disabled,
        maxDate: maxDate || defaultMaxDate,
        minDate: minDate || defaultMinDate,
        name: name,
        onChange: this.onChangeNative,
        required: required,
        value: value,
        valueType: this.valueType
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var className = this.props.className;


      return _react2.default.createElement(
        'div',
        { className: className },
        this.renderNativeInput(),
        this.renderCustomDateInputs(),
        _react2.default.createElement(
          _Divider2.default,
          null,
          '\xA0'
        ),
        this.renderCustomTimeInputs()
      );
    }
  }, {
    key: 'dateDivider',
    get: function get() {
      return '/';
    }

    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'timeDivider',
    get: function get() {
      return ':';
    }

    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'datePlaceholder',
    get: function get() {
      var locale = this.props.locale;

      if (locale === 'en-US') {
        return 'month/day/year';
      }
      return 'day/month/year';
    }

    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'timePlaceholder',
    get: function get() {
      var locale = this.props.locale;

      if (locale === 'en-US') {
        return 'hour-12:minute:second :ampm';
      }
      return 'hour-24:minute:second';
    }
  }, {
    key: 'maxTime',
    get: function get() {
      var maxDate = this.props.maxDate;


      if (!maxDate) {
        return null;
      }

      var _state4 = this.state,
          year = _state4.year,
          month = _state4.month,
          day = _state4.day;


      if ((0, _dates.getYear)(maxDate) !== year || (0, _dates.getMonth)(maxDate) !== month || (0, _dates.getDay)(maxDate) !== day) {
        return null;
      }

      return (0, _dates.getHoursMinutesSeconds)(maxDate);
    }
  }, {
    key: 'minTime',
    get: function get() {
      var minDate = this.props.minDate;


      if (!minDate) {
        return null;
      }

      var _state5 = this.state,
          year = _state5.year,
          month = _state5.month,
          day = _state5.day;


      if ((0, _dates.getYear)(minDate) !== year || (0, _dates.getMonth)(minDate) !== month || (0, _dates.getDay)(minDate) !== day) {
        return null;
      }

      return (0, _dates.getHoursMinutesSeconds)(minDate);
    }
  }, {
    key: 'commonInputProps',
    get: function get() {
      var _this5 = this;

      var _props4 = this.props,
          className = _props4.className,
          disabled = _props4.disabled,
          isWidgetOpen = _props4.isWidgetOpen,
          required = _props4.required;


      return {
        className: className,
        disabled: disabled,
        onChange: this.onChange,
        onKeyDown: this.onKeyDown,
        placeholder: '--',
        // This is only for showing validity when editing
        required: required || isWidgetOpen,
        itemRef: function itemRef(ref, name) {
          // Save a reference to each input field
          _this5[name + 'Input'] = ref;
        }
      };
    }

    /**
     * Returns value type that can be returned with currently applied settings.
     */

  }, {
    key: 'valueType',
    get: function get() {
      var maxDetail = this.props.maxDetail;


      return maxDetail;
    }

    /**
     * Called when non-native date input is changed.
     */


    /**
     * Called when native date input is changed.
     */


    /**
     * Called after internal onChange. Checks input validity. If all fields are valid,
     * calls props.onChange.
     */

  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var nextState = {};

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
      var nextValue = nextProps.value;
      if (
      // Toggling calendar visibility resets values
      nextState.isCalendarOpen // Flag was toggled
      || datesAreDifferent(nextValue, prevState.value)) {
        if (nextValue) {
          var _convert24to = (0, _dates.convert24to12)((0, _dates.getHours)(nextValue));

          var _convert24to2 = _slicedToArray(_convert24to, 2);

          nextState.amPm = _convert24to2[1];

          nextState.year = (0, _dates.getYear)(nextValue);
          nextState.month = (0, _dates.getMonth)(nextValue);
          nextState.day = (0, _dates.getDay)(nextValue);
          nextState.hour = (0, _dates.getHours)(nextValue);
          nextState.minute = (0, _dates.getMinutes)(nextValue);
          nextState.second = (0, _dates.getSeconds)(nextValue);
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
          var year = ('000' + nextProps.minDate.getFullYear()).slice(-4);
          var month = ('0' + (nextProps.minDate.getMonth() + 1)).slice(-2);
          var day = ('0' + nextProps.minDate.getDate()).slice(-2);
          var hour = ('0' + nextProps.minDate.getHours()).slice(-2);
          var minute = ('0' + nextProps.minDate.getMinutes()).slice(-2);
          var second = ('0' + nextProps.minDate.getSeconds()).slice(-2);
          nextState.minDateTimeString = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second;
        } else {
          nextState.minDateTimeString = nextProps.minDate;
        }
      }

      nextState.maxDateTimeString = '9999-31-12T23:59:59';
      if (nextProps.maxDate) {
        if (nextProps.maxDate instanceof Date) {
          var _year = ('000' + nextProps.maxDate.getFullYear()).slice(-4);
          var _month = ('0' + (nextProps.maxDate.getMonth() + 1)).slice(-2);
          var _day = ('0' + nextProps.maxDate.getDate()).slice(-2);
          var _hour = ('0' + nextProps.maxDate.getHours()).slice(-2);
          var _minute = ('0' + nextProps.maxDate.getMinutes()).slice(-2);
          var _second = ('0' + nextProps.maxDate.getSeconds()).slice(-2);
          nextState.maxDateTimeString = _year + '-' + _month + '-' + _day + 'T' + _hour + ':' + _minute + ':' + _second;
        } else {
          nextState.maxDateTimeString = nextProps.maxDate;
        }
      }

      return nextState;
    }
  }]);

  return DateTimeInput;
}(_react.PureComponent);

exports.default = DateTimeInput;


DateTimeInput.defaultProps = {
  maxDetail: 'minute',
  name: 'datetime',
  stepMinute: 1
};

DateTimeInput.propTypes = {
  className: _propTypes2.default.string.isRequired,
  disabled: _propTypes2.default.bool,
  isWidgetOpen: _propTypes2.default.bool,
  locale: _propTypes2.default.string,
  maxDate: _propTypes3.isMaxDate,
  maxDetail: _propTypes2.default.oneOf(allViews),
  minDate: _propTypes3.isMinDate,
  name: _propTypes2.default.string,
  onChange: _propTypes2.default.func,
  onPrevNavigation: _propTypes2.default.func,
  onNextNavigation: _propTypes2.default.func,
  required: _propTypes2.default.bool,
  showLeadingZeros: _propTypes2.default.bool,
  stepMinute: _propTypes2.default.number,
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.instanceOf(Date)])
};

(0, _reactLifecyclesCompat.polyfill)(DateTimeInput);