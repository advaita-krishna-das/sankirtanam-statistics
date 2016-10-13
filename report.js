var underscore = require('underscore');

// Checks report for consistency
// options = { events: {} }
exports.check = function (report, options) {
  var errors = [];
  var eventNames = underscore.map(options.events, function (e) { return e.label; });

  function appendError(fld, msg) {
    errors.push({ field: fld, message: msg });
  }

  // report must have "locaton" field
  if (report.location === null) { // TODO: replace with nullOrEmpty
    appendError("location", "Report must have 'location' field");
  } else {
    if (report.location.length <= 3) { appendError("location", "Location name is to short"); }
    if (report.location.length >= 128) { appendError("location", "Location name to long."); }
    // location name must not have trailing spaces
    // check location existance
  }

  // report must have "data" field
  if (report.date === null) { // TODO: replace with nullOrEmpty
    appendError("date", "Report must have 'date' field");
  } else {
    if (report.date.length <= 0) { appendError("date", "Date name to short."); }
    if (report.date.length >= 128) { appendError("date", "Date name to long."); }
    if (!underscore.contains(eventNames, report.date)) { appendError("date", "Event not found."); }
  }

  // report must have "records" field
  if (report.records === null || report.records.length <= 0) { // TODO: replace with nullOrEmptyArray
    appendError("report", "Report must have 'records' field");
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
