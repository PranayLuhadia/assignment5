class Data{
    
  constructor(students,courses){
      this.students=students;
      this.courses=courses;

  }
}
module.exports.dataCollection = null;

module.exports.initialize=function(){
return new Promise(function(resolve,reject){
  const fs = require('fs')
  fs.readFile('./data/students.json', 'utf8', function(err, student){
      if (err){
          reject(err.msg); // or reject the promise (if used in a promise)
      return; // exit the function
      }
      let studentDataFromFile = JSON.parse(student); // convert the JSON from 
      //the file into an array of objects
      
      ////////////////////////////////////////////////
      fs.readFile('./data/courses.json', 'utf8', function(err, courses){
          if (err){
              reject(err.msg); // or reject the promise (if used in a promise)
          return; // exit the function
          }
          
      let courseDataFromFile = JSON.parse(courses); 
       dataCollection = new Data(studentDataFromFile, courseDataFromFile);
       resolve(dataCollection);

     });
     
});

});
}

module.exports.getAllStudents=function(){
  return new Promise(function(resolve,reject){
      if(dataCollection.students.length==0){
          reject("no results returned")
          return;
      }else{

          resolve(dataCollection.students)
        
      }
  });
}
module.exports.getTAs=function(){
  var array=[];
  return new Promise(function(resolve,reject){

      if(dataCollection.students.length==0){
          reject("no results returned")
          return;
      }else{
      dataCollection.students.forEach((item) =>{
          if(item.TA==true){
              array.push(item);
          } 
         
      }
      ); 
          resolve(array);
          return;
  }
  });
}

module.exports.getCourses=function(){
  return new Promise(function(resolve,reject){
      if(dataCollection.courses.length==0){
          reject("no results returned")
          return;
      }else{
          resolve(dataCollection.courses)
      }


  });
}
module.exports.getStudentsByCourse=function(course){
  var arrayOfStudents=[];
  return new Promise(function(resolve,reject){
      dataCollection.students.forEach((item) =>{
          if(item.course==course){
              arrayOfStudents.push(item);
          } 
         }
      ); 
          //console.log(arrayOfStudents.length)
          if(arrayOfStudents.length==0){
              reject("no results returned")
          }else{
              resolve(arrayOfStudents);
          }
      });
}
module.exports.getStudentByNum=function(num){
  return new Promise(function(resolve,reject){
      var student = new Object();
      dataCollection.students.forEach((item) =>{
          if(item.studentNum==num){
              student=item;
          } 
          }
      ); 
      if(Object.entries(student).length === 0){
          reject("no results returned")
      }else{
          resolve(student);
      }
   
  });

}

module.exports.getCourseById=function(id){
  return new Promise(function(resolve,reject){
      
      var courseObj = new Object();
      dataCollection.courses.forEach((item) =>{
          if(item.courseId==id){
              courseObj=item;
           
           
          } 
          }
      ); 
      if(Object.entries(courseObj).length === 0){
          
          reject("query returned 0 results");
      }else{
          resolve(courseObj);
      }
   
  });

}

module.exports.addStudent=function(studentData){

  return new Promise(function(resolve,reject){
     var newNumber =dataCollection.students.length;
     newNumber=newNumber+1;
          
          let returnedTarget = Object.assign({studentNum: newNumber}, studentData);       
         
         if( dataCollection.students.push(returnedTarget)){

          resolve("It Works")
             return;
         }    
          else{
              reject("It did not work!")
          }

      

  });

 
}

module.exports.updateStudent=function(studentData){
  

  return new Promise(function(resolve,reject){
    
      dataCollection.students.forEach((item) =>{
          if(item.studentNum==studentData.studentNum){
              dataCollection.students.splice(item.studentNum - 1, 1, studentData)
          } 
         }
      ); 
              resolve("It Worked");
  });

 
}


