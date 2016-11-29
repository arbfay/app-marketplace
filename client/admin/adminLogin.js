Template.adminLogin.helpers({
  isAdmin : function(){
    var userMail = Accounts.user().emails[0].address;

    if(userMail ==="faycal@trys.be" || userMail ==="vincent@trys.be"){
      return true;
    } else {
      return false;
    }
  }
});
