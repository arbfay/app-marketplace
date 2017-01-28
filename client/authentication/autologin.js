Template.autologin.onRendered(()=>{
  token = FlowRouter.getParam('token');
  LoginLinks.loginWithToken(token,(e,r)=>{
    if(e){
      alert('Erreur !');
      return;
    } else {
      FlowRouter.go('/profile');
    }
  });
});
