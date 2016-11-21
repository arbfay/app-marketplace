Template.navbar.helpers({
  isCoach : function(id){
    var userMail = Meteor.user().emails[0].address;
    var userProfile = UserProfiles.findOne({email:userMail});

    var test=false;
    if(userProfile){
      test = userProfile.coachId;
    }
    console.log(test);
    return test;
  },
});

Template.navbarUser.events({
  "click .logoutLink": function(event, template){
     event.preventDefault();

     Meteor.logout();
     FlowRouter.go('/');
  }
});
