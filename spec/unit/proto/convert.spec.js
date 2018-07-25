'use strict';

var convert = require('../../../lib/proto/convert');

describe('unit/proto/convert:', function () {
  it('should return empty string when undefined type', function () {
    var actual = convert(undefined);

    expect(actual).toBe('');
  });

  it('should return true when "true"', function () {
    var actual = convert('true');

    expect(actual).toBe(true);
  });

  it('should return false when "false"', function () {
    var actual = convert('false');

    expect(actual).toBe(false);
  });

  it('should return float number', function () {
    var actual = convert('0.014');

    expect(actual).toBe(0.014);
  });

  it('should return string started with 0', function () {
    var actual = convert('0014');

    expect(actual).toBe('0014');
  });

  it('should return int number', function () {
    var actual = convert('136');

    expect(actual).toBe(136);
  });

  it('should return float number', function () {
    var actual = convert('13.6');

    expect(actual).toBe(13.6);
  });

  it('should return string', function () {
    var actual = convert('foo');

    expect(actual).toBe('foo');
  });

  xit('should return string', function () {
    var actual = convert('0.foo');

    expect(actual).toBe('0.foo');
  });
});
