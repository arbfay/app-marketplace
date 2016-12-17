

FlowRouter.notFound={
  action(){
    BlazeLayout.render("mainLayout",{content:"notFoundPage"});
  }
}

FlowRouter.route('/', {
  name:"home",
  action: function(){
    BlazeLayout.render("mainLayout",{content:"mainParallax"});
  }
});

FlowRouter.route('/faq',{
  name:'faq',
  action : function(){
    BlazeLayout.render("mainLayout",{content:"faq"});
  }
});

FlowRouter.route('/conditions',{
  name:'conditions',
  action : function(){
    BlazeLayout.render("mainLayout",{content:"conditionsForUsers"});
  }
});

FlowRouter.route('/about',{
  name:'about',
  action : function(){
    BlazeLayout.render("mainLayout",{content:"about"});
  }
});

FlowRouter.route('/contact-us',{
  name:'contactUs',
  action : function(){
    BlazeLayout.render("mainLayout",{content:"contactUs"});
  }
});

FlowRouter.route('/join-us',{
  name:'joinUs',
  action : function(){
    BlazeLayout.render("mainLayout",{content:"joinUs"});
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

FlowRouter.route('/forgot-password',{
  name:"forgotPassword",
  action: function(){
    BlazeLayout.render("mainLayout", {content:"forgotPassword"});
  }
});

FlowRouter.route('/forgot-password/confirmation',{
  name:"forgotPasswordConfirm",
  action:function(){
    BlazeLayout.render("mainLayout", {content:"forgotPasswordConfirm"});
  }
});

FlowRouter.route('/reset-password/:token',{
  name:"resetPassword",
  action:function(){
    BlazeLayout.render("mainLayout", {content:"resetPassword"});
  }
});

FlowRouter.route('/ranking',{
  name:"ranking",
  action:function(){
    if(Meteor.userId()){
      BlazeLayout.render("mainLayout", {content:"ranking"});
    } else {
      FlowRouter.go('/login');
    }
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
    } else {
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

FlowRouter.route('/coaching/become',{
  name:'becomeCoach',
  action : function(){
    BlazeLayout.render("mainLayout", {content:"becomeCoach"});
    setTimeout({

    })
  }
});

FlowRouter.route('/admin/coaches/insert', {
  name:'insertCoach',
  action:function(){
    if(Meteor.user().emails[0].address ==="faycal@trys.be" || Accounts.user().emails[0].address ==="vincent@trys.be"){
      BlazeLayout.render("adminLayout",{content:"coachInsert"});
    } else {
      FlowRouter.go('/');
    }
  }
});

FlowRouter.route('/admin/lessons/insert', {
  name:"insertLessonByAdmin",
  action: function(){
    if(Meteor.user().emails[0].address ==="faycal@trys.be" || Accounts.user().emails[0].address ==="vincent@trys.be"){
      BlazeLayout.render("adminLayout",{content:"insertLessonByAdmin"});
    } else {
      FlowRouter.go('/');
    }
  }
});

FlowRouter.route('/admin/panel',{
  name:'adminPanel',
  action : function(){
    if(Meteor.user().emails[0].address ==="faycal@trys.be" || Accounts.user().emails[0].address ==="vincent@trys.be"){
      BlazeLayout.render("adminLayout",{content:"adminPanel"});
    } else {
      FlowRouter.go('/');
    }
  }
});

FlowRouter.route('/admin/promo/insert',{
  name:'insertPromo',
  action: function(){
    if(Meteor.user().emails[0].address ==="faycal@trys.be" || Accounts.user().emails[0].address ==="vincent@trys.be"){
      BlazeLayout.render("adminLayout",{content:"promoCodeInsert"});
    } else {
      FlowRouter.go('/');
    }
  }
});

FlowRouter.route('/admin94Coffee',{
  name:'adminLogin',
  action: function(){
    BlazeLayout.render("adminLayout",{content:"adminLogin"});
  }
});
