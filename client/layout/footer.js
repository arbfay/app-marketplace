Template.footer.events({
  "click #feedbackBtn" : function(event,template){
    event.preventDefault();

    swal({
          title: "Feedback",
          text: "Un bug, un mauvais fonctionnement, une suggestion, des conseils ? C'est ici que vous pouvez nous les envoyer.",
          type: "input",
          inputType:"textarea",
          showCancelButton: true,
          cancelButtonText:"Annuler",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Envoyer",
          closeOnConfirm: false
        },
        function(feedback){
          Meteor.call('sendMail',"faycal@trys.be","contact@trys.be","Feedback",feedback,function(err,res){
            if(err){
              swal("Echec", "Un erreur s'est produite de l'envoi du feedback. Veuillez réessayer plus tard.", "error");
            } else{
                swal("Envoyé", "Merci de participer à la construction d'un meilleur service !", "success");
            }
          });
        });
  }
});

Template.footer.helpers({
  actualLang : function(template){
    var lang = TAPi18n.getLanguage();

    if(lang==="fr"){
      return "Français";
    } else {
      return "English";
    }
  },
  otherLangA : function(temlpate){
    var lang = TAPi18n.getLanguage();

    if(lang==="fr"){
      return "Français";
    } else {
      return "English";
    }
  }
})
