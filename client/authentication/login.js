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
        redirectionLogin();
      }
    });
    target.password.value="";
  }
});

redirectionLogin = function(){
  if(Session.get('reservationLogin')){
    Materialize.toast('Sélectionnez une date, et cliquez sur "réserver".', 5000, 'rounded');
    FlowRouter.go('/class/'+Session.get('reservationLogin'));
  } else {
    FlowRouter.go('/');
  }
}
