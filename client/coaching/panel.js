Template.coachingPanel.helpers({

  coachLessons : function(){
    //partant du principe que celui qui arrive sur cette page est forcement un coach
    var coachEmail =Accounts.user().emails[0].address;
    Meteor.subscribe("lessonsFromCoach",coachEmail)
    var l = Lessons.find({coachEmail:coachEmail}).fetch();

    if(l){
      return l;
    }
    else {
      return {};
    }
  },
  title : function(){
    var lessonId = Session.get('lessonId');
    var lesson = Lessons.findOne(lessonId);

    return lesson.title;
  },
  dateTime : function(){
    var lessonId = Session.get('lessonId');
    var lesson = Lessons.findOne(lessonId);

    return lesson.moment.format("ddd D MMM à HH:mm");
  }
});

Template.attendingListTemplate.helpers({
  users: function(){
    var lessonId=Session.get('lessonId');
    var aL = Lessons.findOne(lessonId).attendeesList;
    console.log(aL);
    Meteor.subscribe('attendessListById', aL);

    var res = AttendeesList.findOne(aL).users;
    console.log(res);
    if(res){
      return res;
    } else {
      return {};
    }
  },
  firstName : function(){
    var res = getNames();
          console.log(res);
          Session.set('firstName',res.firstName);
          Session.set('lastName', res.lastName);

    return Session.get('firstName');
  },
  lastName : function(){
    return Session.get('lastName');
  }
});

Template.coachingLessonItem.events({
  "click a" : function(event){
    event.preventDefault();
    console.log('Before : ' +Session.get('lessonId'));
    Session.set('lessonId', this._id);
    console.log('After : ' +Session.get('lessonId'));
  }
});
