Note: It is recommended to install MongoDB Compass

Create data dir:

	$ mkdir data

Initialize MongoDB:

	$ mongod --path /data

Access MongoDB Shell:

	$ mongo

or

	$ mongo -host localhost:27017

Main commands:

	$ db.help()
	
	$ show dbs (show available dbs)
	
	$ db (show selected db)
	
	$ use grades (select grades db)
	Obs.: grades db must have a inserted document to be created.

	$ db.student.insert({name: "Gabriel Brum"})
	Obs.: Now grades db and student collection are created.
	
	$ db.dropDatabase() (delete current db)

Collections main commands:

	$ db.createCollection("student")
	Obs.: Be aware of the selected db.

	$ show collections

	$ db.students.drop() (delete a collection)

	$ db.createCollection("log", {capped: true, size: 1024, max: 10})
	Obs.: Create a log collection that maintains only the 10 most recent values.

CRUD:

	- INSERT:

	$ db.student.insertOne({name: "Maria dos Anjos"});

	Obs.: Returns 
	{
		"acknowledged": true, 
		"insertedId": ObjectId("somegeneratedid")
	};

	$ db.student.insertMany([
		{
			name: "Marco Antonio",
			subject: "Matematica",
			type: "Trabalho Pratico",
			value: 15.4
		},
		{
			name: "Ana Maria Silva"
			subject: "Portugues",
			type: "Prova Final",
			value: 23.8
		}
	])

	Obs.: Returns
	{
		"acknowledged": true, 
		"insertedIds": [
			ObjectId("somegeneratedid"),
			ObjectId("anothergeneratedid"),
		]
	}

	$ db.student.insert({name: "Pedro Augusto", subject: "Historia"})
	
	Obs.: Allows to insert one or many (must wrap it in []) documents. 
	When one, returns writeResult({ "nInserted: 1"}).
	When more than one, returns BulkWriteResult{"..., nInserted: 2, ..."}.

	- SELECT:

	$ db.student.find() (select all)

	$ db.student.find({query}*,{projection}**) *conditions **which fields
	
	$ db.student.find({}, {_id:0, name: 1, value: 1}).limit(4) (select name, value from student limit 4)
	
	$ db.student.find({}, {_id:0, name: 1, value: 1}).skip(1) (skip first register)
	
	$ db.student.find({}, {_id:0, name: 1, value: 1}).sort({name:1}) (order by name ASC)
	$ db.student.find({}, {_id:0, name: 1, value: 1}).sort({name:-1}) (order by name DESC)
	
	$ db.student.find({}, {_id:0, name: 1, value: 1}).pretty()
	
	$ db.student.findOne()

	$ db.student.find({subject: "Fisica"},{_id: 0}).pretty() (where subject = 'Fisica')
	
	$ db.student.find({
		$and:[
			{subject: "Fisica"},
			{type: "Prova Final"}
		]},{_id: 0}).pretty()

	$ db.student.find({
		$not:[
			{subject: "Fisica"},
			{type: "Prova Final"}
		]},{_id: 0}).pretty()

	$ db.student.find({
		$or:[
			{subject: "Fisica"},
			{subject: "Matematica"}
		]},{_id: 0}).pretty()

	# $eq (=), $ne (!=), $gt (>), $gte (>=), $in, $nin (not in), $lt (<), $lte (<=)

	$ db.student.find({value: {$gt: 20}}, {_id: 0}).pretty()
	$ db.student.find({subject: {$in: ["Fisica", "Matematica"]}}, {_id: 0}).pretty()

	- UPDATE:

	$ db.COLLECTION.updateOne(query, update, options)

	$ db.student.updateOne(
		{
			name: "Ana Maria Silva",
			subject: "Portugues"
		},
		{
			$set: {type: "Trabalho Pratico"}
		}
	)

	$ db.student.updateMany(
		{
			subject: "Matematica",
			type: "Trabalho Pratico"
		},
		{
			$inc: {value: 2}
		}
	)

	$ db.student.updateMany({}, {
		$currentDate: {lastModified: true, timestamp: {$type: "timestamp"}}
	})

	Obs.: includes 2 new fields to student collection with values

	$ db.student.updateMany({}, {
		$unset: {timestamp: 1}
	})

	$ db.student.replaceOne(
		{
			_id: ObjectId("asudhiauh1i2u3hiausdh")
		},
		{
			name: "Lucas Pereira",
			subject: "Fisica",
			type: "Prova Final",
			value: 15.3,
			lastModified: new Date()
		}
	)

	Obs.: Replaces the entire document with another

	- DELETE:

	$ db.student.deleteOne({
		_id: ObjectId("aushd1i31u2hasd")
	})

	$ db.student.deleteMany({
		subject: "Fisica"
	})

BulkWrite

	$ db.COLLECTION.bulkWrite([commands], options)

	$ db.student.bulkWrite([
		{
			insertOne: {
				"document": {
					name: "Gabriel Brum", 
					subject: "Fisica", 
					type: "Prova Final, 
					value: 16, 
					timestamp: new Date()
				}
			}
		},
		{
			updateOne: {
				"filter": {
					name: "Marco Antonio", 
				},
				"update": {
					$set: {
						subject: Artes
					}
				}
			}
		},
		{
			deleteOne: {
				"filter": {
					name: "Pedro Augusto",
					type: "Trabalho Pratico",
					subject: "Historia"
				}
			}
		},
		{
			replaceOne: {
				"filter": {
					_id: ObjectId("aksd123haisud")
				},
				"replace": {
					name: "Tais Bernardes",
					subject: "Fisica",
					type: "Trabalho Pratico",
					valye: 12,
					lastModified: new Date()
				}
			}
		}
	], {ordered: false})


