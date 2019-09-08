"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FiltersProvider = FiltersProvider;
exports.FiltersContext = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ARRAY_VALUES_SEPARATOR = ",";

function splitHashToPathAndQuery(str) {
  return decodeURIComponent(str).split("?");
}

function createObjectFromUrlSearchParams(usp) {
  return Array.from(usp.entries()).reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    var splitedVal = val.includes(ARRAY_VALUES_SEPARATOR) ? val.split(ARRAY_VALUES_SEPARATOR) : val;
    return _objectSpread({}, acc, _defineProperty({}, key, splitedVal));
  }, {});
}

var FiltersContext = (0, _react.createContext)({});
exports.FiltersContext = FiltersContext;

function FiltersProvider(_ref3) {
  var children = _ref3.children;

  var _useState = (0, _react.useState)({}),
      _useState2 = _slicedToArray(_useState, 2),
      filters = _useState2[0],
      setFilters = _useState2[1];

  (0, _react.useEffect)(function () {
    var handleHashChange = function handleHashChange() {
      try {
        var _splitHashToPathAndQu = splitHashToPathAndQuery(window.location.hash),
            _splitHashToPathAndQu2 = _slicedToArray(_splitHashToPathAndQu, 2),
            queryStr = _splitHashToPathAndQu2[1];

        var usp = new URLSearchParams(queryStr);
        var filtersObject = createObjectFromUrlSearchParams(usp);
        setFilters(filtersObject || {});
      } catch (e) {
        setFilters({});
      }
    };

    handleHashChange();
    window.onhashchange = handleHashChange;
    return function () {
      window.onhashchange = null;
    };
  }, []);

  function setUserFilters(filtersObject) {
    var filtersObjectWithExistingValues = Object.entries(filtersObject).filter(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          value = _ref5[1];

      if (value === false) return true;
      return !!value;
    }).reduce(function (accumulator, _ref6) {
      var _ref7 = _slicedToArray(_ref6, 2),
          key = _ref7[0],
          value = _ref7[1];

      return _objectSpread({}, accumulator, _defineProperty({}, key, value));
    });

    var _splitHashToPathAndQu3 = splitHashToPathAndQuery(window.location.hash),
        _splitHashToPathAndQu4 = _slicedToArray(_splitHashToPathAndQu3, 1),
        path = _splitHashToPathAndQu4[0];

    var usp = new URLSearchParams(filtersObjectWithExistingValues);
    window.location.hash = "".concat(path, "?").concat(usp.toString());
  }

  function resetFilters() {
    var _splitHashToPathAndQu5 = splitHashToPathAndQuery(window.location.hash),
        _splitHashToPathAndQu6 = _slicedToArray(_splitHashToPathAndQu5, 1),
        path = _splitHashToPathAndQu6[0];

    window.location.hash = path;
  }

  var ctx = {
    filters: filters,
    setFilters: setUserFilters,
    reset: resetFilters
  };
  return _react["default"].createElement(FiltersContext.Provider, {
    value: ctx
  }, children);
}