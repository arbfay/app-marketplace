Template.navbar.helpers({
  isCoach : function(id){
    document.title="Trys | Yoga, Pilates et Tai Chi à Bruxelles";

    if(Accounts.user()){
      var userMail =Accounts.user().emails[0].address;

      Meteor.subscribe("matchingCoachByMail", userMail);
      var coach = Coaches.findOne();
      var coachId="";
      if(coach){coachId = coach._id;}

      Meteor.subscribe("matchingUserProfileByCoachId", coachId);
      var userProfile = UserProfiles.findOne({email:userMail});


      var test=false;
      if(userProfile && userProfile.coachId){
        test = userProfile.coachId;
      }
      return test;
    } else {
      return false;
    }
  },
});

Template.navbarUser.events({
  "click .logoutLink": function(event, template){
     document.title="Trys | Yoga, Pilates et Tai Chi à Bruxelles";
     event.preventDefault();

     Meteor.logout();
     FlowRouter.go('/');
  }
});

Template.navbarCoach.events({
  "click .logoutLink": function(event, template){
     event.preventDefault();

     Meteor.logout();
     FlowRouter.go('/');
  }
});

Template.newNavbarUser.helpers({
  isCoach : function(id){
    document.title="Trys | Yoga, Pilates et Tai Chi à Bruxelles";

    if(Accounts.user()){
      var userMail =Accounts.user().emails[0].address;

      Meteor.subscribe("matchingCoachByMail", userMail);
      var coach = Coaches.findOne({email:userMail});
      var coachId="";
      if(coach){coachId = coach._id;}

      Meteor.subscribe("matchingUserProfileByCoachId", coachId);
      var userProfile = UserProfiles.findOne({email:userMail});


      var test=false;
      if(userProfile && userProfile.coachId){
        test = userProfile.coachId;
      }
      return test;
    } else {
      return false;
    }
  },
});
