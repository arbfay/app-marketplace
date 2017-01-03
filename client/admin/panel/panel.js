Template.statsPanel.helpers({
  lessonsCount:function(){
    var c = 0;
    Meteor.call("count","lessons",(err, res)=>{
      if(res){
        Session.set('countingLessons', res);
      } else {
        console.log(err);
      }
    });

    c = Session.get('countingLessons');
    return {stat : c,
            name :'Cours',};
  },
  coachesCount:function(){
    var c=0;
    Meteor.call("count","coaches",(err, res)=>{
      if(res){
        Session.set('countingCoaches', res);
      } else {
        console.log(err);
      }
    });

    c = Session.get('countingCoaches');
    return {stat : c,
            name : 'Coachs',};
  },
  reservationsCount:function(){
    var c=0;
    Meteor.call("count","reservations",(err, res)=>{
      if(res){
        Session.set('countingRes', res);
      } else {
        console.log(err);
      }
    });

    c = Session.get('countingRes');
    return {stat: c,
            name: 'Reservations',};
  },
  usersCount : function(){
    var c=0;
    Meteor.call("count","users",(err, res)=>{
      if(res){
        Session.set('countingUsers', res);
      } else {
        console.log(err);
      }
    });

    c = Session.get('countingUsers');
    return {stat : c,
            name : 'Utilisateurs',};
  }
});



Template.statCard.events({
  "click .btn" : function(event){
    event.preventDefault();

    console.log('click');
  }
});

Template.buttonItems.events({
  "click .insertLesson" : function(event){
    event.preventDefault();
    FlowRouter.go('/admin/lessons/insert');
  },
  "click .insertCoach" : function(event){
    event.preventDefault();
    FlowRouter.go('/admin/coaches/insert');
  },
  "click .insertPromo" : function(event){
    event.preventDefault();
    FlowRouter.go('/admin/promo/insert');
  },
  "click .updateLesson" : function(event){
    event.preventDefault();
    FlowRouter.go('/admin/lessons/update/find');
  }
})

Template.submittedLessons.helpers({
  sbLessons:function(){
    Meteor.subscribe('getAllSubmittedLessons',function(err,res){
      if(err){
        console.log(err);
        Materialize.toast('Error publication',4000,'rounded');
      }
    });

    return SubmittedLessons.find();
  },
  dateTime:function(){
    var mom = moment(this.date);
    return mom.format("ddd DD MMMM");
  },
  submitDate:function(){
    var mom = moment(this.createdAt);
    return mom.fromNow();
  }
});

Template.submittedLessons.events({
  "click .btnApprove" : function(event){
    event.preventDefault();
    var sbLesson = this;
    console.log(this);
    var sbLessonId = sbLesson._id;
    delete sbLesson._id;
    Meteor.call("insertLessonByAdmin", sbLesson,function(err,res){
      if(err){
        console.log(err);
      } else {
        Materialize.toast('Lesson approuvée',4000,'rounded');
        Meteor.call('removeSubmittedLesson',sbLessonId,function(error,result){
          if(error){
            console.log(error);
          } else {
            Materialize.toast('submittedLesson removed',4000,'rounded');
          }
        });
      }
    });
  },
  "click .btnRefuse" : function(event){
    event.preventDefault();
    var sbLesson = this;
    console.log(this);
    var sbLessonId = sbLesson._id;
    Meteor.call('removeSubmittedLesson',sbLessonId,function(error,result){
      if(error){
        console.log(error);
      } else {
        Materialize.toast('submittedLesson removed',4000,'rounded');
      }
    });
  }
});
