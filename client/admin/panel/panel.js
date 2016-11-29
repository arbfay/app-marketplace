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
})
