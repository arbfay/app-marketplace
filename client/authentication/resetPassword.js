Template.resetPassword.events({
  "submit .reset" : function(event){
    event.preventDefault();
    var newPassword = event.target.password.value;

    var token = FlowRouter.getParam('token');
    if(token){
      Accounts.resetPassword(token,newPassword, function(err){
        if(err){
          Materialize.toast("Une erreur s'est produite.",4000,'rounded');
          console.log(err);
        } else {
          Materialize.toast('Nouveau mot de passe enregistré !', 4000,'rounded');
          FlowRouter.go('/');
        }
      });
    } else {
      Materialize.toast('Problème de sécurité observé.', 4000,'rounded');
    }
  }
});
