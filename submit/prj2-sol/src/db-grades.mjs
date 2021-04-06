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
	const errors = [];
	try {
		const handler = await mongo.connect(dbUrl, MONGO_CONNECT_OPTIONS);
		const db = handler.db('main');
		const dbg = new DBGrades(db, handler);
		return dbg;
	}
	catch(err) {
		errors.push(new AppError("DB: cannot connect to URL " + dbUrl + ": "+ err));
	}
   	if(errors.length > 0) {
   		return errors
   	}
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
	const errors = [];
	try {
		var gtable = this.db.collection(courseInfo.id);
		await gtable.updateOne({courseId: courseInfo.id}, {$set:{grades: rawGrades}}, {upsert: true});
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
    const errors = [];
    try {
    	var rawData = await this.raw(courseInfo);
    	try {
    		var grades = await CourseGrades.make(courseInfo, rawData);
    		grades = await grades.add(triples);
    		await this.import(courseInfo, grades.raw());
    	}
    	catch(err) {
    		errors.push(new AppError("Error importing: " + err));
    	}
    }
    catch(err) {
    		errors.push(new AppError("Cannot find course: " + err));
    }
  
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
	const errors = [];
	try {
		var data = await this.raw(courseInfo);
		try {
			const grades = await CourseGrades.make(courseInfo, data);
			return grades.query(options);
		}
		catch(err) {
			errors.push(new AppError("Error making new coursegrades: " + err));
		}
	}
	catch(err) {
		errors.push(new AppError("Error exporting: " + err));
	}
	if(errors.length>0) { 
		return errors;
	}
	
	
  }

  /** return raw grades without stats for courseId */
  async raw(courseInfo) { 
	const errors = [];
	try {
		var gtable = await this.db.collection(courseInfo.id);
		var ret = gtable.distinct('grades');
		return ret;
	}
	catch(err) {
		errors.push(new AppError("Error exporting: " + err));
	}
    if (errors.length > 0) {
    	return errors;
    }
	
  }

}

}

