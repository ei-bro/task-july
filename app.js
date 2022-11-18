const express = require("express");
const app = express();

const mysqlConnection = require("./connect.js");

mysqlConnection.connect((err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("connected");
	}
});

app.get("/install", (req, res) => {
	const installTable = ` CREATE TABLE if not exist Task (
	task_name VARCHAR(255),
	id INT NOT NULL AUTO_INCREMENT,
	completed BOOLEAN DEFAULT false,
	PRIMARY KEY (id)
) `;
	mysqlConnection.query(installTable, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.send("table create");
		}
	});
});

app.use(express.json());

// get all tasks
app.get("/tasks", (req, res) => {
	const allTasks = `SELECT * FROM Task;`;
	mysqlConnection.query(allTasks, (err, result) => {
		if (err) {
			return res.status(500).json({ msg: err });
		} else {
			return res.status(200).json({ result });
		}
	});
});

// get single task
app.get("/task/:id", (req, res) => {
	const id = req.params.id;
	const singleTask = `SELECT * FROM Task WHERE id ="${id}";`;
	mysqlConnection.query(singleTask, (err, result) => {
		if (err) {
			return res.status(500).json({ msg: err });
		}
		if (result.length < 1) {
			return res.status(404).send(`No task with id : ${id}`);
		} else {
			return res.status(200).json({ result });
		}
	});
});

// create task
app.post("/task", (req, res) => {
	const name = req.body.name;
	console.log(req.body);
	if (!name) {
		return res.status(401).send("plese provide data");
	}
	const createTask = `INSERT INTO task (task_name) VALUES ("${name}") `;

	mysqlConnection.query(createTask, (err, result) => {
		if (err) {
			console.log(err);
			return res.send(err);
		} else {
			return res.status(201).send("task created");
		}
	});
});

// update single task
app.patch("/task/:id", (req, res) => {
	const id = req.params.id;
	// console.log(id);
	let name = req.body.name;
	let completed = req.body.completed;

	if (completed) {
		completed = 1;
	}
	// console.log(req.body);

	const updateTask = `UPDATE task
	SET task_name = "${name}",
		completed = ${completed}
		WHERE id=${id}`;

	mysqlConnection.query(updateTask, (err) => {
		if (err) {
			console.log(err);
			return res.send(err);
		} else {
			const singleTask = `SELECT * FROM Task WHERE id ="${id}";`;
			mysqlConnection.query(singleTask, (err, result) => {
				if (err) {
					return res.status(500).json({ msg: err });
				} else {
					return res.status(200).json({ result });
				}
			});
		}
	});
});

// delete single task
app.delete("/task/:id", (req, res) => {
	const id = req.params.id;

	const deletTask = `DELETE FROM task WHERE id=${id}`;

	mysqlConnection.query(deletTask, (err) => {
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		} else {
			return res.status(200).send("task deleted");
		}
	});
});

app.listen(5000, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("listning to port 5000");
	}
});
