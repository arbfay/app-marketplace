Template.loginForm.events({
  "submit form": function(event){
    event.preventDefault();

    var target=event.target;
    var email = target.email.value;
    var password= target.password.value;

    Meteor.loginWithPassword(email, password, function(error){
      if(error != null){
        Materialize.toast('E-mail ou mot de passe incorrect.', 4000, 'rounded');
      } else{
        Materialize.toast("Plus tu t'entraîneras, meilleur tu seras !", 4000, 'rounded');
      }
    });

    target.email.value="";
    target.password.value="";
    FlowRouter.go('/');
  }
});
