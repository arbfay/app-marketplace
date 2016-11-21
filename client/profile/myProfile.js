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
    Meteor.logout(function(){
        FlowRouter.route('/');
    });
  },
});

function getNames (){

  var userMail = "";
  if(Accounts.user()){
    var userMail = Accounts.user().emails[0].address;
  }

  var userProfile = UserProfiles.findOne({email:userMail});

  if(userProfile){
    var firstName = userProfile.firstName;
    var lastName = userProfile.lastName;
    return {
      firstName : firstName,
      lastName : lastName
    };
  } else{
    return {
      firstName : "Prénom",
      lastName : "Nom"
    };
  }
}
Template.myProfile.helpers({
  firstName : function(){
    var res = getNames();
          console.log(res);
          Session.set('firstName',res.firstName);
          Session.set('lastName', res.lastName);
          
    return Session.get('firstName');
  },
  lastName : function(){
    return Session.get('lastName');
  }
});

Template.myRes.helpers({
  reservationsList : function(){
    var userId = Meteor.userId();
    var r1 = Reservations.find({userId:userId}).fetch();
    var r2 = r1.filter(function(r){
      return r.isPaid == true;
    });
    console.log(r2);
    return r2;
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
