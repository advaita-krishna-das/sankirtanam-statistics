module.exports = (db) => {
	const underscore = require('underscore');

	// ===========================================================================
	locations = (term, callback) => {
		let lterm = term.toLowerCase();

		let processData = (error, body) => {
			// Some DB error occured
			if (error) {
				callback({ error });
				return;
			}

			// Map DB result to pretty JSON
			let result = underscore.filter(body.locations, (item) => {
				let label = item.label.toLowerCase();
				return label.indexOf(lterm) != -1;
			}) || [];

			// Return results back
			callback(result);
		};

		db.get('config:locations', processData);
	};

	// ===========================================================================
	events = (term, callback) => {
		let lterm = (term || "").toLowerCase();

		let processData = (error, body) => {
			// Some DB error occured
			if (error) {
				callback({ error });
				return;
			}

			// Map DB result to pretty JSON
			let result = underscore.filter(body.events, (item) => {
				let label = item.label.toLowerCase();
				return label.indexOf(lterm) != -1;
			});

			// Return results back
			callback(result);
		};

		db.get('config:events', processData);
	};

	// ===========================================================================
	return {
		locations,
		events
	};
};
