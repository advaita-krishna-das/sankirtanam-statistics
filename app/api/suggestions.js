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

		let processData = (events) => {
			// Map DB result to pretty JSON
			let lterm = (term || "").toLowerCase();
			let result = underscore.filter(events, (item) => {
				let label = item.label.toLowerCase();
				return label.indexOf(lterm) != -1;
			});

			// Return results back
			callback(result);
		};

		generateEvents(processData);
	};

	generateEvents = (callback) => {
		/*db.get('config:events', processData);*/
		var names = [
			"Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август",
			"Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
			"Марафон Прабхупады", "Марафон Гаура-пурнимы"
		];
		var years = [2014, 2015, 2016, 2017, 2018];
		var currentYear = new Date().getFullYear();
		var typeF = (name) => name.startsWith("Марафон") ? "event" : "monthly";
		var result = [];

		for (var year = 2015; year <= currentYear; year++) {
			for (var name in names) {
				result.push({
					label: names[name] + " " + year,
					type: typeF(names[name])
				});
			}
		}

		callback(result);
	};

	// ===========================================================================
	return {
		locations,
		events,
		generateEvents
	};
};
