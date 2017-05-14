var fs = require('fs');
var countries = new Map();

fs.readFile('euroviisu.csv', 'utf-8', (err, data) => {
    var rows = data.split('\n');

    for (var i = 1; i < rows.length; i++) {
        var row = rows[i].split(';');
        var from = row[0];

        if (!countries[from]) {
            countries[from] = { juryPoints: [], televotePoints: [] };
        }

        if (parseInt(row[9]) != 0)
            countries[from].juryPoints.push({ country: row[1], points: parseInt(row[9]) });
        if (parseInt(row[10]) != 0)
            countries[from].televotePoints.push({ country: row[1], points: parseInt(row[10]) });
    }

    console.log(JSON.stringify(countries));
});
