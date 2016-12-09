Meteor.publish('nearLessons', function(loc,lim, now){
  console.log(loc);

  check(lim, Number);
  check(loc.coordinates[0], Number);
  check(loc.coordinates[1], Number);


  var lessons=Lessons.find({
    geospatial:
      {$nearSphere: [loc.coordinates[0],loc.coordinates[1]]},
    maxAttendeesLeft :
      {$gt : 0},
    date :
      {$gt : now}
    },
    {
     sort : {date : 1},
     limit : lim,
     fields : {
       attendeesList:0,
       commission:0
     }});

    return lessons;
});

Meteor.publish('searchLessons', function(query, options){
  return Lessons.find(query,options);
});

Meteor.publish('matchingLesson', function(id){
  //Limit to 3 + the 3 next lessons by time
  return Lessons.find(id);
});

Meteor.publish('matchingLessonsByFirstId', function(id,now){
  var lesson = Lessons.findOne(id);

  var tit = lesson.title;
  var lessons=Lessons.find({
    title : tit,
    maxAttendeesLeft :
      {$gt : 0},
    date :
      {$gt : now}
    },
    {
     sort : {date : 1},
     limit : 3,
     fields : {
       attendeesList:0,
       commission:0
     }});

  return lessons;
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

Meteor.publish('namesOfUser', function(email){
  return UserProfiles.find({email : email});
});

Meteor.publish('reservationById', function(id){
  return Reservations.find({_id:id});
});

Meteor.publish('myReservations', function(id){
  var res = Reservations.find({userId:id,
                               isPaid:true,});
  return res;
});

Meteor.publish('getCategories', function(){
  return Categories.find();
})

Meteor.publish('promoCode', function(code){
  check(code, String);
  return PromoCodes.find({code:code},{fields:{code:1,reductionToApply:1}});
})
