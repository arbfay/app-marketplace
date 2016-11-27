Template.navbar.helpers({
  isCoach : function(id){
    var userMail = Meteor.user().emails[0].address;

    Meteor.subscribe("matchingCoachByMail", userMail);
    var coach = Coaches.findOne();
    var coachId = coach._id;

    Meteor.subscribe("matchingUserProfileByCoachId", coachId);
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
