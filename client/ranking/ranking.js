Template.ranking.helpers({
  points : function(){
    if(Accounts.user()){
      var userMail = Accounts.user().emails[0].address;
    } else{
      return "";
    }

    Meteor.subscribe('userProfileByMail', userMail);
    var userProfile = UserProfiles.findOne({email:userMail});

    return userProfile.points;
  }
});
