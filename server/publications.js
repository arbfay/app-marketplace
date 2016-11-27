Meteor.publish('nearLessons', function(loc,lim){
  check(lim, Number);
  check(loc.coordinates[0], Number);
  check(loc.coordinates[1], Number);

  return Lessons.find({
    geospatial:{$nearSphere: [loc.coordinates[0],loc.coordinates[1]]},
    maxAttendeesLeft : {$gt : 0}});
});

Meteor.publish('matchingLesson', function(id){
  //Limit to 3 + the 3 next lessons by time
  return Lessons.find(id);
});

Meteor.publish('matchingLessonsByFirstId', function(id){
  var lesson = Lessons.findOne(id);

  var title = lesson.title;
  return Lessons.find({title : title});
});

Meteor.publish('lessonsFromCoach', function(email){
  //add moment
  return Lessons.find({coachEmail : email});
});

Meteor.publish('attendessListById', function(id){
  return AttendeesList.find(id);
});

Meteor.publish('matchingCoachByMail', function(coachEmail){
  return Coaches.find({email : coachEmail});
});

Meteor.publish('matchingUserProfileByCoachId', function(coachId){
  return UserProfiles.find({coachId : coachId});
});

Meteor.publish('userByMail', function(email){
  var r= Accounts.findUserByEmail(email);

  return Meteor.users.find(r._id);
});

Meteor.publish('userProfileByMail', function(email){
  return UserProfiles.find({email : email});
});
