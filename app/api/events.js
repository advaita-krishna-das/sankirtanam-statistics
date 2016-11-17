module.exports = () => {
	generateEvents = () => {
		var names = [
			"Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август",
			"Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
			"Марафон Прабхупады", "Марафон Гаура Пурнимы", "Марафон Нрисимха Чатурдаши",
			"Марафон Джанмаштами"
		];
    var startYear = 2015;
    var currentYear = new Date().getFullYear();
		var result = [];

		for (var year = currentYear; year >= startYear; year--) {
			for (var name in names) {
				result.push({
					label: names[name] + " " + year,
					type: getEventType(names[name]),
					actions: getActions(names[name], year)
				});
			}
		}

		return result;
	};

  getEventType = (name) => {
    return name.startsWith("Марафон") ? "event" : "monthly";
  };

  getActions = (name, year) => {
    return name == "Марафон Прабхупады" ? { "copy": "Декабрь " + year } : null;
  };

	return {
		generateEvents
	};
};
