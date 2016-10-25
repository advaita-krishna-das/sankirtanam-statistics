var underscore = require('underscore');

// Checks report for consistency
// options = { events: {} }
exports.check = function (report, options) {
  var errors = [];
  var eventNames = underscore.map(options.events, function (e) { return e.label; });

  function appendError(fld, msg) {
    errors.push({ field: fld, message: msg });
  }

  function isEmpty(value) {
    if (value === null) return true;
    return !value.trim();
  }

  function isContainsWhiteSpaces(value) {
    if (value.trim() != value) return true;
    return false;
  }

  // report must have "locaton" field
  if (isEmpty(report.location)) {
    appendError("location", "Не указана локация");
  } else {
    if (report.location.length <= 3) { appendError("location", "Название локации слишком короткое"); }
    if (report.location.length >= 128) { appendError("location", "Название локации слишком длинное"); }
    if (isContainsWhiteSpaces(report.location)) { appendError("location", "Название локации не должно содержать пробелов в начале и конце"); }
    // check location existance
  }

  // report must have "event" field
  if (isEmpty(report.event)) {
    appendError("event", "Не указана дата/событие");
  } else {
    if (report.event.length <= 3) { appendError("event", "Название даты/события слишком короткое"); }
    if (report.event.length >= 128) { appendError("event", "Название даты/события слишком длинное"); }
    if (isContainsWhiteSpaces(report.event)) { appendError("event", "Название даты/события не должно содержать пробелов в начале и конце"); }
    if (!underscore.contains(eventNames, report.event)) { appendError("event", "Дата/событие не найдено"); }
  }

  // report must have "records" field
  if (report.records === null || report.records.length <= 0) { // TODO: replace with nullOrEmptyArray
    appendError("report", "Нет данных отчёта");
  } else {
    // TODO: check for counts field
    // TODO: check for dates field
  }

  // return result
  return {
    success: errors.length === 0,
    errors: errors
  };
};
