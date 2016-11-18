Template.coachingPanel.helpers({
  /*dataCont: function(){
    var a = Session.get('lessonId');
    var l=Lessons.findOne(a);
    console.log(l);
    if(l){
      console.log(l.attendeesList);
      var aL = attendeesList.findOne(l).users;
      return aL;
    } else{
      console.log('No such lesson');
      return {};
    }
  },*/
  coachLessons : function(){
    //partant du principe que celui qui arrive sur cette page est forcement un coach
    var l = Lessons.find({userEmail:Accounts.user().emails[0].address}).fetch();
    console.log(l);
    if(l){
      return l;
    }
    else {
      return {};
    }
  },
});



Template.attendingListTemplate.helpers({
  users: function(){
    var lessonId=Session.get('lessonId');
    var aL = Lessons.findOne(lessonId).attendeesList;
    console.log(aL);
    var res = AttendeesList.findOne(aL).users;
    console.log(res);
    if(res){
      return res;
    } else {
      return {};
    }
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
