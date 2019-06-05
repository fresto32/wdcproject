var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
	if (req.session.user === true) {
		next();
	} else {
		res.sendStatus(403);
	}
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*
 ANY REGISTERED USERS
 */
router.post('/updatePassword', function(req, res, next) {
	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			res.send();
			throw err;
		}

		var query = "UPDATE account SET password_hash=SHA2(?,256) WHERE account_id=?;";	
		connection.query(query, [req.body.pass, req.session.userid], function(err, rows, fields) {
			connection.release();
			res.send();
		});
	});
});

router.post('/updateEmail', function(req, res, next) {
	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			res.send();
			throw err;
		}

		var query = "UPDATE account SET email=? WHERE account_id=?;";	
		connection.query(query, [req.body.email, req.session.userid], function(err, rows, fields) {
			connection.release();
			res.send();
		});
	});
});

router.post('/deleteAccount', function(req, res, next) {
	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			res.send();
			throw err;
		}

		var query = "DELETE FROM account WHERE account_id=?;";	
		connection.query(query, [req.session.userid], function(err, rows, fields) {
			connection.release();
			res.send();
		});
	});
});

/*
 RESTAURANT GUEST REGISTERED USERS
 */
// router.get('/guestUpcomingReserations', function (req, res, next) {
// 	if (req.session.manager === true) {
// 		res.sendStatus(403);
// 	}

// 	req.pool.getConnection(function(err, connection) {
// 		if (err) {
// 			res.send();
// 			throw err;
// 		}

// 		var query = "SELECT"
// 	})
// }

/*
 MANAGER
 */
// GET request of manager - parameter : account id
router.get('/manager', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
	} else {
		// connect to the database
		req.pool.getConnection(function(err, connection) {
			if (err) {
				res.send();
				throw err;
			}

			var manageraccount = req.session.userid;
			var query = "SELECT restaurant_id, name " +
				"FROM restaurant WHERE account_id=?;";	
			connection.query(query, [manageraccount], function(err, rows, fields) {
				connection.release();
				res.json(rows);
			});
		});
	}
});

// Select restaurant to manage
router.post('/selectRest', function (req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
	}

	req.session.restaurantid = req.body.restaurantid;
	next();
});

// GET request of manager - parameter : account id
router.get('/getRestInfo', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
	}
	
	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
			res.send();
		}

		var query = "SELECT * FROM restaurant WHERE restaurant_id=? AND account_id=?;";	
		connection.query(query, [req.session.restaurantid, req.session.userid], function(err, rows, fields) {
			connection.release();
			res.json(rows);
		});
	});
});

// POST request of manager
router.post('/addNewRestInfo', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
	}
	
	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
			res.send();
		}

		var newRestID = uuid.v4();
		var query = "INSERT INTO restaurant (restaurant_id, account_id, name, address, " + 
			"phone, capacity, desciption, cost, cuisine, diet_options) " + 
			"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	
		connection.query(query, [newRestID, req.session.userid, req.body.name,
			req.body.address, req.body.phone, req.body.capacity, req.body.desciption, req.body.cost,
			req.body.cuisine, req.body.diet_options],
			function(err, rows, fields) {
				connection.release();
				req.session.restaurantid = newRestID;
				res.send();
		});
	});
	next();
});

// POST request of manager
router.post('/updateRestInfo', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
	}
	
	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
			res.send();
		}

		var query = "UPDATE restaurant SET name=?, address=?, phone=?, capacity=?, desciption=?, "+
			"cost=?, cuisine=?, diet_options=? WHERE restaurant_id=? AND account_id=?;";	
		connection.query(query, [req.body.name, req.body.address, req.body.phone, req.body.capacity,
			req.body.desciption, req.body.cost, req.body.cuisine, req.body.diet_options,
			req.session.restaurantid, req.session.userid],
			function(err, rows, fields) {
				connection.release();
				res.send();
		});
	});
});

// POST request of manager
router.post('/deleteRestInfo', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
		next('route');
	}
	
	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
			res.send();
		}

		var query = "DELETE FROM restaurant WHERE restaurant_id=? AND account_id=?;";	
		connection.query(query, [req.session.restaurantid, req.session.userid],
			function(err, rows, fields) {
				connection.release();
				res.send();
		});
	});
});


// POST adding restaurant image - request is just JSON object with one url
router.post('/addRestImg', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
		next('route');
	}
	
	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
			res.send();
		}

		var imgID = uuid.v4();
		var query = "INSERT INTO rest_img_url (img_id, restaurant_id, img_url, is_menu) VALUES " + 
			"(?, ?, ?, false);";	
		connection.query(query, [imgID, req.session.restaurantid, req.body.url],
			function(err, rows, fields) {
				connection.release();
				res.send();
		});
	});
});

// POST adding restaurant image - request is just JSON object with one url
router.post('/deleteRestImg', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
		next('route');
	}
	
	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
			res.send();
		}

		var imgID = uuid.v4();
		var query = "DELETE FROM rest_img_url WHERE restaurant_id=? AND img_id=? AND is_menu=false;";	
		connection.query(query, [req.session.restaurantid, req.body.url],
			function(err, rows, fields) {
				connection.release();
				res.send();
		});
	});
});

// POST adding restaurant MENU image - request is just JSON object with one url
router.post('/addRestMenuImg', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
	}
	
	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			res.send();
			throw err;
		}

		var imgID = uuid.v4();
		// var query = "INSERT INTO rest_img_url (img_id, restaurant_id, img_url, is_menu) VALUES " + 
		// 	"(?, ?, ?, true);";	
		var query = "INSERT INTO rest_img_url (img_id, restaurant_id, img_url, is_menu) VALUES " +
			"(?,(SELECT restaurant.restaurant_id FROM restaurant INNER JOIN account ON " + 
			"restaurant.account_id = account.account_id WHERE restaurant.restaurant_id=? " + 
			"AND account.account_id=?), ?, false);"
		connection.query(query, [imgID, req.session.restaurantid, req.session.userid, req.body.url],
			function(err, rows, fields) {
				if (err) {
					res.sendStatus(403);
				}
				connection.release();
				res.send();
		});
	});
});

// POST adding restaurant MENU image - request is just JSON object with one url
router.post('/deleteRestMenuImg', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
	}
	
	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			res.send();
			throw err;
		}

		// var query = "DELETE FROM rest_img_url WHERE restaurant_id=? AND img_id=? AND is_menu=true;";	
		var query = "DELETE rest_img_url.* FROM rest_img_url " + 
			"INNER JOIN restaurant ON rest_img_url.restaurant_id = restaurant.restaurant_id " +
			"INNER JOIN account ON restaurant.account_id = account.account_id " +
			"WHERE rest_img_url.restaurant_id=? AND rest_img_url.img_id=? AND restaurant.account_id=?;";
		connection.query(query, [req.session.restaurantid, req.body.url, req.session.userid],
			function(err, rows, fields) {
				if (err) {
					res.sendStatus(403);
				}
				connection.release();
				res.send();
		});
	});
});

// Add a restaurant opening - recieve a JSON object in request, containing day, start, end
router.post('/addRestOpenings', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
	}

	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
			res.send();
		}
		var query = "INSERT INTO rest_open_times (restaurant_id, day, start, end) VALUES " +
			"((SELECT restaurant.restaurant_id FROM restaurant INNER JOIN account ON " + 
			"restaurant.account_id = account.account_id WHERE restaurant.restaurant_id=? " + 
			"AND account.account_id=?), ?, ?, ?);";
		connection.query(query, [imgID, req.session.restaurantid, req.session.userid, req.body.day,
			req.body.start, req.body.end],
			function(err, rows, fields) {
				if (err) {
					res.sendStatus(403);
					next('route');
				}
				connection.release();
				res.send();
		});
		// var query = "INSERT INTO rest_open_times (restaurant_id, day, start, end) VALUES " + 
		// 	"(?, ?, ?, ?);";	
		// connection.query(query, [req.session.restaurantid, req.body.day, req.body.start, req.body.end],
		// 	function(err, rows, fields) {
		// 		connection.release();
		// 		res.send();
		// });
	});
});

// Modify a restaurant booking estimate time - recieve a JSON object in request, containing duration,
// min guests, and max guest
router.post('/updateRestOpenings', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
	}
	
	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
			res.send();
		}

		var query = "UPDATE rest_open_times " + 
			"INNER JOIN restaurant ON rest_img_url.restaurant_id = restaurant.restaurant_id " +
			"INNER JOIN account ON restaurant.account_id = account.account_id " +
			"SET rest_open_times.day=?, rest_open_times.start=?, rest_open_times.end=? "+
			"WHERE rest_img_url.restaurant_id=? AND restaurant.account_id=? AND rest_open_times.day=? "
			"rest_open_times.start=?, rest_open_times.end=?;";
		connection.query(query, [req.body.day, req.body.start, req.body.end,
			req.session.restaurantid, req.session.userid, req.body.prev_day, req.body.prev_start, 
			req.body.prev_end],
			function(err, rows, fields) {
				if (err) {
					res.sendStatus(403);
					next('route');
				}
				connection.release();
				res.send();
		});
	});
});

// Delete a restaurant opening
router.post('/deleteRestOpenings', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
	}

	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			res.send();
			throw err;
		}

		var query = "DELETE rest_open_times.* FROM rest_open_times " + 
			"INNER JOIN restaurant ON rest_img_url.restaurant_id = restaurant.restaurant_id " +
			"INNER JOIN account ON restaurant.account_id = account.account_id " +
			"WHERE rest_img_url.restaurant_id=? AND restaurant.account_id=? AND rest_open_times.day=? "
			"rest_open_times.start=?, rest_open_times.end=?;";
		connection.query(query, [req.session.restaurantid, req.session.userid, req.body.day, 
			req.body.start, req.body.end],
			function(err, rows, fields) {
				if (err) {
					res.sendStatus(403);
					next('route');
				}
				connection.release();
				res.send();
		});
		// var query = "DELETE FROM rest_open_times WHERE restaurant_id=? AND day=? AND start=? AND end=?;";	
		// connection.query(query, [req.session.restaurantid, req.body.day, req.body.start, req.body.end],
		// 	function(err, rows, fields) {
		// 		connection.release();
		// 		res.send();
		// });
	});
});

// Add a restaurant booking estimate time - recieve a JSON object in request, containing duration,
// min guests, and max guest
router.post('/addRestBookEst', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
	}

	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
			res.send();
		}
		var query = "INSERT INTO rest_booking_est_time (restaurant_id, account_id, duration, " +
			"guest_min, guest_max) VALUES (?, ?, ?, ?, ?);";
		connection.query(query, [eq.session.restaurantid, req.session.userid, req.body.duration,
			req.body.guest_min, req.body.guest_max],
			function(err, rows, fields) {
				connection.release();
				res.send();
		});
	});
});

// Modify a restaurant booking estimate time - recieve a JSON object in request, containing new and old
// duration, min guests, and max guest
router.post('/updateRestBookEst', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
	}
	
	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
			res.send();
		}

		var query = "UPDATE rest_booking_est_time SET duration=?, guest_min=?, guest_max=? " +
			"WHERE restaurant_id=? AND account_id=? AND duration=? AND guest_min=? AND guest_max=?;";	
		connection.query(query, [req.body.duration, req.body.guest_min, req.body.guest_max,
			req.session.restaurantid, req.session.userid, req.body.prev_duration, 
			req.body.prev_guest_min, req.body.prev_guest_max],
			function(err, rows, fields) {
				if (err) {
					res.sendStatus(403);
					next('route');
				}
				connection.release();
				res.send();
		});
	});
});

// Delete a restaurant opening
router.post('/deleteRestBookEst', function(req, res, next) {
	if (req.session.manager != true) {
		res.sendStatus(403);
	}

	// connect to the database
	req.pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
			res.send();
		}

		var query = "DELETE FROM rest_booking_est_time WHERE restaurant_id=? AND account_id=? " + 
			"AND duration=? AND guest_min=? AND guest_max=?;";
		connection.query(query, [req.session.restaurantid, req.session.userid, req.body.duration,
			req.body.guest_min, req.body.guest_max],
			function(err, rows, fields) {
				if (err) {
					res.sendStatus(403);
					next('route');
				}
				connection.release();
				res.send();
		});
	});
});


module.exports = router;
