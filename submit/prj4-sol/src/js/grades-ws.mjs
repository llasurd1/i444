import jsUtils from 'cs544-js-utils';
const { AppErrors } = jsUtils;

export default class GradesWs {
  constructor(url) {
    this.url = url;
  }

  /** Make a `GET` request to /:courseId/grades?queryParams.
   *  Return success object or object having an errors
   *  property.
   */
  async grades(courseId, queryParams) {
    // TODO
    try{
    	const param = queryParams.sessionId;
    	const response  = await (await fetch(`${this.url}/${courseId}/grades?sessionId=${param}`, {
    		method: 'GET',
    	}));
    	if(response.ok) {
    		return response.json();
    	}
    	else
    		return new AppErrors().add(new AppErrors("error"));
    }
    catch(err) {
	return new AppErrors().add(err);	
    }
    
    
  }

  /** Make a `GET` request to /:courseId/raw?queryParams.
   *  Return success object or object having an errors
   *  property.
   */
  async raw(courseId, queryParams) {
    // Not required for this project.
    return null;
  }

  /** Make a `GET` request to
   *  /:courseId/students/:studentId?queryParams.  Return success
   *  object or object having an errors property.
   */
  async student(courseId, studentId, queryParams) { 
    try{
    	const param = queryParams.sessionId;
    	const response  = await( await fetch(`${this.url}/${courseId}/students/${studentId}?sessionId=${param}`, {
    		method: 'GET',
    	}));
    	if(response.ok) {
    		return response.json();
    	}
    	else
    		return new AppErrors().add(new AppErrors("error"));
    }
    catch(err) {
	return new AppErrors().add(err);	
    }
   
  }

  /** Make a `PATCH` request to /courseId/grades?queryParams passing
   *  updates as request body.  Return success object or object having
   *  an errors property.
   */
  async update(courseId, queryParams, updates) {
    // Not required for this project.
    return null;
  }
  
}


  

  
