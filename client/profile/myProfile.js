Template.myProfile.events({
  "click .myInfo" (event){
    event.preventDefault();
    BlazeLayout.render('myProfile', {content:'myInfo'});
  },
  "click .myRes" (event){
    event.preventDefault();
    BlazeLayout.render('myProfile', {content:'myRes'});
  },
  "click .changePass" (event){
    event.preventDefault();
    BlazeLayout.render('myProfile', {content:'changePass'});
  },
  "click .logOut" (event){
    event.preventDefault();
    Meteor.logout();
    FlowRouter.go('/');
  },
});

Template.myProfile.helpers({
  firstName : function(){
    var email = Accounts.user().emails[0].address;
    Meteor.subscribe('namesOfUser',email);
    var user = UserProfiles.findOne({email:email});

    return user.firstName;
  },
  lastName : function(){
    var email = Accounts.user().emails[0].address;
    var user = UserProfiles.findOne({email:email});

    return user.lastName;
  }
});

Template.myRes.helpers({
  reservationsList : function(){
    var userId = Meteor.userId();
    Meteor.subscribe("myReservations", userId);
    var r1 = Reservations.find({userId:userId}).fetch();

    return r1;
  },
});

Template.changePass.events({
  "submit .chaPas" (event){
      event.preventDefault();

      var t=event.target;
      var oldPass = t.oldPassword.value;
      var newPass= t.newPassword.value;

      if(newPass !== null || newPass !== ""){
        Accounts.changePassword(oldPass, newPass, function(err){
           if(err){
             alert("Erreur lors de la modification");
           } else {
             Materialize.toast("Modification enregistrée.", 4000, 'rounded');
           }
        });
      } else {
        Materialize.toast("Nouveau mot de passe vide.", 4000, 'rounded');
      }
  }
});

Template.myResItem.helpers({
  dateForHuman:function(){
    var mom = moment(this.lessonDate);
    return mom.format("ddd DD MMM, HH:mm");
  },

});
