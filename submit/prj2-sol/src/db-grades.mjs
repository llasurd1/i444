import { AppError, CourseGrades } from 'course-grades';

import mongo from 'mongodb';

//use in mongo.connect() to avoid warning
const MONGO_CONNECT_OPTIONS = { useUnifiedTopology: true };

const GRADES_COLLECTION = 'grades';

export default class DBGrades {
  constructor(db, handler) {
	this.db =  db;
	this.handler = handler;
  }
  //factory method
  static async make(dbUrl) {
	let errors = [];
	try {
		const db = await mongo.connect(dbUrl, MONGO_CONNECT_OPTIONS);
		const handler = db.db('main');
		const dbg = new DBGrades(db, handler);
	}
	catch(err) {
		errors.push(new AppError("DB: cannot connect to URL " + dbUrl + ": "+ err));
	}
    return (errors.length > 0) ? { errors } : dbg;
  }

  /** Release all resources held by this instance.
   *  Specifically, close any database connections.
   */
  async close() {
	await this.handler.close();
	return;
  }

  
  /** set all grades for courseId to rawGrades */
  async import(courseInfo, rawGrades) {
    //@TODO
	const errors = [];
	try {
		var gtable = this.db.collection(courseInfo);
		await gtable.updateOne({courseId: courseInfo.id}, {$set: rawGrades}, {upsert: true});
	}
	catch(err) {
		errors.push(new AppError("Error importing: " + err));
	}
	if(errors.length > 0) { 
		return errors; 
	}
	
  }

  /** add list of [emailId, colId, value] triples to grades for 
   *  courseId, replacing previous entries if any.
   */
  async add(courseInfo, triples) {
    //@TODO
  }

  /** Clear out all courses */
  async clear() {
    //@TODO
	let collections = ["courseId", "studentId", "assgnId", "grade"];
	for(var collection of collections) {
		let temp = this.db.collection(collection);
		await temp.deleteMany({});
	}
  }
  
  /** return grades for courseId including stats.  Returned
   *  grades are filtered as per options.selectionSpec and
   *  projected as per options.projectionSpec.
   */
  async query(courseInfo, options) {
    //@TODO
	let errors = [];
	try {
		const data = raw(courseInfo);
	}
	catch {
		errors.push(new AppError("Error exporting: " + err));
	}
	try {
		const grades = course-grades.make*courseInfo, data);
	}
	catch {
		errors.push(new AppError("Error making new coursegrades: " + err));
	}
	return grades.query(options);
  }

  /** return raw grades without stats for courseId */
  async raw(courseInfo) { 
    //@TODO
	let errors = [];
	try {
		var gtable = this.db.collection(courseInfo);
		let ret = gtable._grades;
	}
	catch(err) {
		errors.push(new AppError("Error exporting: " + err));
	}
    return (errors.length > 0) ? { errors } : ret;
	
  }

}

