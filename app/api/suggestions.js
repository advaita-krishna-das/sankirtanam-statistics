module.exports = (db) => {
	const underscore = require('underscore');
	const eventsGenerator = require('./events')();

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

		let e = eventsGenerator.generateEvents();
		processData(e);
	};

	generateEvents = (callback) => {
		var names = [
			"Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август",
			"Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
			"Марафон Прабхупады", "Марафон Гаура Пурнимы", "Марафон Нрисимха Чатурдаши",
			"Марафон Джанмаштами"
		];
		var currentYear = new Date().getFullYear();
		var getEventType = (name) => name.startsWith("Марафон") ? "event" : "monthly";
		var getActions = (name, year) => name == "Марафон Прабхупады" ? { "copy": "Декабрь " + year } : null;
		var result = [];

		for (var year = 2015; year <= currentYear; year++) {
			for (var name in names) {
				result.push({
					label: names[name] + " " + year,
					type: getEventType(names[name]),
					actions: getActions(names[name], year)
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
