const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const Bing = require('node-bing-api')({ accKey: 'db63791f74064c3ca3a65570902162f5' });

const searchTerm = require('./models/searchTerm');
const searchResult = require('./models/searchResult');

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/searchTerms');

app.use(express.static(__dirname + '/public'));

app.get('/api/:searchVal(*)', (req, res, next) => {
	const { searchVal } = req.params;
	let { offset } = req.query;
	let searchOffset = 0;

	if (offset) {
		if (offset === 1) {
			offset = 0;
			searchOffset = 1;
		} else if (offset > 1) {
			searchOffset = offset + 1;
		}
	} else {
		offset = 0;
			searchOffset = 1;
	}
	Bing.images(
		searchVal,
		{
			top: (10 * searchOffset),
			skip: (10 * offset)
		},
		(error, resonse, body) => {
			const bingData = [];

			for (let i = 0; i < 10; i++) {
				bingData.push(new searchResult(body.value[i]));
			}

			res.json(bingData);
		}
	);
});

app.get('/recent-searches', (req, res, next) => {
	searchTerm.find({}, (err, data) => {
		res.json(data);
	});
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Listening!');
});
