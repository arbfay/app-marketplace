Template.forgotPassword.events({
  "submit .reset": function(event,template){
    event.preventDefault();

    var email = event.target.email.value;

    if(email){
      Meteor.call("sendResPasswordEmail",email,function(err){
        if(err){
          Materialize.toast("Une erreur s'est produite.", 4000, 'rounded');
          console.log(err);
        } else{
          Session.set("emailProcessed", email);
          FlowRouter.go('/forgot-password/confirmation');
        }
      });
    }
  }
});

Template.forgotPasswordConfirm.helpers({
  enteredEmail: function(){
    return Session.get("emailProcessed");
  }
});
