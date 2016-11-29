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
    var mom = moment(lesson.date);
    return mom.format("ddd DD MMM, HH:mm");
  }
});

Template.attendingListTemplate.helpers({
  users: function(){
    var lessonId=Session.get('lessonId');
    var aL = Lessons.findOne(lessonId).attendeesList;
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
    var email = this.email;
    Meteor.subscribe('namesOfUser',email);
    var user = UserProfiles.findOne({email:email});

    return user.firstName;
  },
  lastName : function(){
    var email = this.email;
    var user = UserProfiles.findOne({email:email});

    return user.lastName;
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

Template.coachingLessonItem.helpers({
  dateForHuman : function(){
    var mom = moment(this.date);
    return mom.format("ddd DD MMM, HH:mm");
  }
});
