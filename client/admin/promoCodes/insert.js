Template.promoCodeInsert.events({
  "submit form" (event){
    event.preventDefault();

    var t=event.target;

    var code = t.codePromo.value;

    var author = Accounts.user().emails[0].address;

    var maxUsage = t.maxUsage.value;
    maxUsage=parseInt(maxUsage);

    var maxPerUser = t.maxPerUser.value;
    maxPerUser = parseInt(maxPerUser);

    var reductionToApply = t.reductionToApply.value;
    reductionToApply=parseFloat(reductionToApply);

    var comment = t.comment.value;

    var toInsert = {
      code : code,
      author:author,
      maxUsage : maxUsage,
      maxPerUser : maxPerUser,
      reductionToApply: reductionToApply,
      comment:comment,
      createdAt:new Date(),
    };

    Meteor.call("insertPromo", toInsert, (err,res) =>{
      console.log(res);
      console.log(err);
      if(res){
        console.log(res);
        Materialize.toast("Code ajouté !", 4000, 'rounded');
      } else {
        Materialize.toast("Problème lors de l'insertion.", 4000,'rounded');
      }
    });

    t.codePromo.value="";
    t.comment.value="";
  }
});
