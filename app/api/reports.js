module.exports = (db) => {
	const underscore = require('underscore');
	const bookScores = [2, 1, 0.5, 0.25, 0]; // last one value means count of books
                                           // get from "days" array. Don't count it as scores.

	// ===========================================================================
	/// By days report
	byDays = (eventName, callback) => {
		let searchOptions = {
			inclusive_end: true,
			startkey: [eventName, null, null],
			endkey: [eventName, "\u9999", "\u9999"]
		};

		let processData = function(error, body) {
			// Some DB error occured
			if (error) {
				callback({ error });
				return;
			}

			// Map DB result to pretty JSON
			let result = underscore.map(body.rows, function(row) {
				let name = row.key[1];
				let location = row.key[2];
				let books = row.value[0];
				let days = row.value[1];
				return { name, location, books, days };
			});

			// Return results back
			callback(result);
		};

		// Query DB
		db.view('overall', 'daysByPerson', searchOptions, processData);
	};


	// ===========================================================================
	// By person
	byPerson = (eventName, callback) => {
		let searchOptions = {
			reduce: true,
			group_level: 3,
			inclusive_end: true,
			startkey: [eventName, null],
			endkey: [eventName, "\u9999"]
		};

		let processData = function(error, body) {
			// Some DB error occured
			if (error) {
				callback({ error });
				return;
			}

			// Map DB result to pretty JSON
			let result = underscore.map(body.rows, function(row) {
				let name = row.key[1];
				let location = row.key[2];
				let books = row.value;
				let scores = books.map((v, i) => v * bookScores[i]);
				let overallBooks = books.reduce((pv, cv) => pv + cv, 0);
				let overallScores = scores.reduce((pv, cv) => pv + cv, 0);

				return { name, location, books, scores, overallBooks, overallScores };
			});

			// Return results back
			callback(result);
		};

		// Query DB
		db.view('overall', 'overallByPerson', searchOptions, processData);
	};


	// ===========================================================================
	/// By event
	byEvent = (eventName, callback) => {
		let searchOptions = {
			reduce: true,
			group_level: 2,
			inclusive_end: true,
			startkey: [eventName, null],
			endkey: [eventName, "\u9999"]
		};

		let processData = function(error, body) {
			// Some DB error occured
			if (error) {
				callback({ error });
				return;
			}

			// Map DB result to pretty JSON
			let result = underscore.map(body.rows, (row) => {
				let location = row.key[1];
				let books = row.value;
				let scores = books.map((v, i) => v * bookScores[i]);
				let overallBooks = books.reduce((pv, cv) => pv + cv, 0);
				let overallScores = scores.reduce((pv, cv) => pv + cv, 0);

				return { location, books, scores, overallBooks, overallScores };
			});

			// Return results back
			callback(result);
		};

		// Query DB
		db.view('overall', 'overallByEvent', searchOptions, processData);
	};

	// ===========================================================================
	/// By location
	byLocation = (callback) => {
		let searchOptions = {
			reduce: true,
			group_level: 1
		};

		let processData = function(error, body) {
			// Some DB error occured
			if (error) {
				callback({ error });
				return;
			}

			// Map DB result to pretty JSON
			let result = underscore.map(body.rows, function(row) {
				let location = row.key;
				let books = row.value;
				let scores = books.map((v, i) => v * bookScores[i]);
				let overallBooks = books.reduce((pv, cv) => pv + cv, 0);
				let overallScores = scores.reduce((pv, cv) => pv + cv, 0);

				return { location, books, scores, overallBooks, overallScores };
			});

			// Return results back
			callback(result);
		};

		// Query DB
		db.view('overall', 'overallByLocation', searchOptions, processData);
	};

	// ===========================================================================
	return {
		byDays,
		byPerson,
		byEvent,
		byLocation
	};
};
