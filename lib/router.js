FlowRouter.route('/', {
  name:"home",
  action: function(){
    BlazeLayout.render("mainLayout",{content:"mainParallax"});
  }
});

FlowRouter.route('/signup', {
  name:"signup",
  action: function(){
    BlazeLayout.render("mainLayout",{content:"signupForm"});
  }
});

FlowRouter.route('/login', {
  name:"login",
  action: function(){
    BlazeLayout.render("mainLayout",{content:"loginForm"});
  }
});

FlowRouter.route('/admin/lessons/insert', {
  name:"insertLessonByAdmin",
  action: function(){
    BlazeLayout.render("adminLayout",{content:"insertLessonByAdmin"});
  }
});

FlowRouter.route('/search', {
  name:"search",
  action: function(params,queryParams){
    BlazeLayout.render("mainLayout",{content:"searchResults"});
  }
});

FlowRouter.route('/profile',{
  name:"profile",
  action: function(){
    if(Meteor.userId()){
      BlazeLayout.render("myProfile", {content:"myInfo"});
    }else {
      FlowRouter.go('/login');
    }
  }
});

FlowRouter.route('/class/:lessonId',{
  name:"lessonPage",
  action: function(){
    BlazeLayout.render("mainLayout",{content: "lessonPage"});
  }
});

FlowRouter.route('/class/:lessonId/:reservationId',{
  name:"resConfirmation",
  action: function(){
    if(Meteor.userId()){
      BlazeLayout.render("mainLayout",{content:"reservationConfirmation"});
    } else{
      FlowRouter.go('/login');
    }
  }
});

FlowRouter.route('/reservation/:reservationId/confirmation',{
  name:"resDone",
  action: function(){
    if(Meteor.userId()){
      BlazeLayout.render("mainLayout",{content:"reservationRecap"});
    } else{
      FlowRouter.go('/login');
    }
  }
});

FlowRouter.route('/admin/coaches/insert', {
  name:'insertCoach',
  action:function(){
    if(Meteor.userId()){
      BlazeLayout.render("adminLayout", {content:"coachInsert"});
    } else{
      FlowRouter.go('/');
    }
  }
});

FlowRouter.route('/coaching/panel',{
  name:'coachingPanel',
  action:function(){
    if(Meteor.userId()){
      BlazeLayout.render("mainLayout", {content:"coachingPanel"});
    } else{
      FlowRouter.go('/');
    }
  }
});

FlowRouter.route('/admin/panel',{
  name:'adminPanel',
  action : function(){
    if(Meteor.userId()){
      BlazeLayout.render("adminLayout", {content:"adminPanel"});
    } else{
      FlowRouter.go('/');
    }
  }
})
