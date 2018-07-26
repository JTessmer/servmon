const os = require('os');

const express = require('express');

const app = express();
const router = express.Router();


router.route('/uptime').get(	require('./module/uptime')		);
router.route('/memory').get(	require('./module/memory')		);
router.route('/disk').get(		require('./module/disk')		);
router.route('/cpu').get(		require('./module/cpu')			);
router.route('/processes').get(	require('./module/processes')	);

app.use('/api', router);

app.get('/', (req, res) => {
	res.json({
		'/api': [
			'/uptime',
			'/memory',
			'/disk',
			'/cpu',
			'/processes'
		]
	});
});


const server = app.listen(3000, () => {
	console.log('Express is listening on port 3000!');
});
