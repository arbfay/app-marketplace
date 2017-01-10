

geocode = function(address){
  if(GoogleMaps.loaded()){
      var geocoder = new google.maps.Geocoder();
      var results = geocoder.geocode({'address': address}, function(results, status){
        if(status === google.maps.GeocoderStatus.OK){
            coord=results[0].geometry.location;
            lat = coord.lat();
            lng = coord.lng();
            loc = {
              type:"Point",
              coordinates:[
                lng,
                lat
              ]
            };
            Session.set('loc',loc);
          } else {
            console.log("Problem with the geocoder : " + status);
          }
        });
  } else {
    console.log("error with GoogleMaps");
    loc = {
      type:"Point",
      coordinates:[
        4.371,
        50.843
      ]
    };
    Session.set('loc',loc);
  }
};

Template.coachingPanel.helpers({
  coachProfile:function(){
    var coachEmail = Accounts.user().emails[0].address;
    Meteor.subscribe("lessonsFromCoach",coachEmail, function(err,res){
      if(err){Materialize.toast("Une erreur s'est produite dans le serveur.", 4000, 'rounded');}
    });


    var coach = Coaches.findOne();

    var up = UserProfiles.findOne({email:coach.email});

    var imgUrl = coach.imgUrl;
    if(coach.imgUrl==""){
      imgUrl="http://placehold.it/300/9e9e9e/000000?text=Photo";
    }

    var coach = Coaches.findOne();
    var coachId="";
    if(coach){coachId = coach._id;}

    Meteor.subscribe('coachClients',coachId,
      function(err,res){
        if(err){
          Materialize.toast('Erreur avec les clients.');
          console.log(err);
        }
      }
    );

    Meteor.subscribe('coachCards',coachId,
      function(err,res){
        if(err){
          Materialize.toast('Erreur avec les cartes.');
          console.log(err);
        }
      }
    );

    return {
      firstName:up.firstName,
      lastName:up.lastName,
      imgUrl:imgUrl,
    };
  },

});


Template.coachingPanel.events({

  "click .cpHome" : function(event,template){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelHome'});
  },
  "click .cpProfile" : function(event,template){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelProfile'});
  },
  "click .cpLessons" : function(event,template){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelLessons'});
  },
  "click .cpClients" : function(event,template){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelClients'});
  },
  "click .cpContact" : function(event,template){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelContact'});
  },

});

Template.coachingPanelHome.helpers({
  nextLessons : function(){
    if(!Accounts.user()){ return [];}
    var coachEmail =Accounts.user().emails[0].address;
    var dateNow = new Date();
    var now = dateNow.getTime();
    var l = Lessons.find({coachEmail:coachEmail,
                          date:{$gt:now}
                        },{sort : {date : 1},
                          limit : 3});
    if(l){
      return l;
    }
    else {
      return [];
    }
  },
  stats : function(){
    var clients=0;
    var trysReservations=0;
    var comingLessons=0;
    return {clients:clients,
       trysReservations:trysReservations,
       comingLessons : comingLessons};
  },
  infoCards : function(){
    var infos = [{content:"Toutes les séances sur votre Panneau de Gestion sont automatiquement référencées sur le site web pour que les utilisateurs puissent réserver leur place."},
      {content:"A chaque fois que vous inscrivez un client à l'une de vos séances, le nombre de place est automatiquement diminué."},
      {content:"Seules les personnes s'étant inscrites par le site web peuvent participer au concours mensuel et espérer gagner un cadeau."},
      {content:"Pour des raisons de sécurité, vos informations bancaires ne peuvent être modifiées qu'en contactant directement notre équipe."}];

    return infos;
  }
});

Template.basicCoachLessonCard.helpers({
 dateTime:function(){
   var mom = moment(this.date);
   return mom.format("ddd DD MMM, HH:mm");
 }
});

Template.basicCoachLessonCard.events({
  "click .cpLesson" : function(){
    Session.set("lessonId", this._id);
    BlazeLayout.render('coachingPanel', {content:'coachingPanelLesson'});
  }
});

Template.coachingPanelProfile.helpers({
  coachProfile : function(){
    var coach = Coaches.findOne();
    var up = UserProfiles.findOne({email:coach.email});
    var imgUrl = coach.imgUrl;
    if(coach.imgUrl==""){
      imgUrl="http://placehold.it/300/9e9e9e/000000?text=Photo";
    }
    var ad = up.address.street + "," + up.address.zip + " " + up.address.city;

    return {
      firstName:up.firstName,
      lastName:up.lastName,
      imgUrl:imgUrl,
      address : ad,
      email : coach.email,
      tel : up.tel,
      description : coach.description,
    };
  }
});

Template.coachingPanelProfile.events({
  "submit #updateCoachProfile" : function(event,template){
    event.preventDefault();

    var t = event.target;
    var firstName = t.firstName.value;
    var lastName = t.lastName.value;
    var street = t.street.value;
    var zip = t.zip.value;
    var city = t.city.value;
    var tel = t.tel.value;

    var coach = Coaches.findOne();
    var up = UserProfiles.findOne({email:coach.email});
    if(firstName==""){
      firstName=up.firstName;
    }
    if(lastName==""){
      lastName=up.lastName;
    }
    if(tel==""){
      tel=up.tel;
    }
    if(zip==""){
      zip=up.address.zip;
    }
    if(street==""){
      street=up.address.street;
    }
    if(city==""){
      city=up.address.city;
    }
    var upData = {
      firstName :firstName,
      lastName : lastName,
      tel:tel,
      address : {
        street : street,
        zip : zip,
        city : city,
      },
      updatedAt: new Date()
    };



    Meteor.call("updateUserProfile", up._id, upData, function(error, result){
      if(error){
        console.log("error", error);
      }
    });

    var description = t.description.value;
    if(description==""){
      description=coach.description;
    }

    var coachData = {
      description :description,
      updatedAt : new Date()
    };


    var image = document.getElementById('photo').files[0];
    var reader = new FileReader();
    var imgUrl = "";

    if(image){
      reader.onloadend=function(e){
        const data = new FormData();
        data.append('file', e.target.result);
        data.append('upload_preset', "f5ok4rwp");
        var url ="https://api.cloudinary.com/v1_1/trys/image/upload";
        var xhr = new XMLHttpRequest();

        xhr.open("POST", url, true);
        xhr.onreadystatechange=function(){
          if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
            var response = JSON.parse(xhr.responseText);
            console.log("response :", response);
            imgUrl=response.secure_url;
            coachData.imgUrl=imgUrl;

            Meteor.call("updateCoach", coach._id, coachData, function(error, result){
              if(error){
                console.log("error", error);
              } else {
                Materialize.toast('Modifications enregistrées !', 4000, 'rounded');
              }
            });
          }  };
      xhr.send(data);
    }
      reader.readAsDataURL(image);
    } else {
      Materialize.toast("Problèmes rencontrés avec l'image, veuillez réessayer plus tard.", 4000, 'rounded');
      Meteor.call("updateCoach", coach._id, coachData, function(error, result){
        if(error){
          console.log("error", error);
        } else {
          Materialize.toast('Modifications enregistrées !', 4000, 'rounded');
        }
    });
  }

  }
});

Template.coachingPanelClients.helpers({
  clients : function(){
    return Clients.find({},{sort : {lastName:1}});
  },
  coachCards : function(){
    return CoachCards.find();
  },
});

Template.coachingPanelClients.events({
  "click .newClient":function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelClientInsert'});
  },
  "click .newCard":function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelCardInsert'});
  },
  "click .clickable": function(event){
    event.preventDefault();
    Session.set("clientId", this._id);
    BlazeLayout.render('coachingPanel', {content:'coachingPanelClient'});
  },
  "click .editClient":function(event){
    event.preventDefault();
    Session.set("clientId", this._id);
    BlazeLayout.render('coachingPanel', {content:'coachingPanelClientUpdate'});
  },
  "click .deleteClient":function(event){
    event.preventDefault();
    var clientId=this._id;
    swal({
      title: "Êtes-vous certain(e) ?",
      text: "Suppression du client.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Effacer",
      cancelButtonText: "Annuler",
      closeOnConfirm: false,
    },
    function(){
        swal("Effacé!", "Le client a été effacé", "success");
        Meteor.call('removeClient', clientId);
    });
  },
});


Template.coachingPanelClient.helpers({
  client : function(){
    var clientId = Session.get("clientId");
    if(!clientId){
      return [];
    }
    return Clients.findOne({_id:clientId});
  },
  cards : function(){
    var clientId = Session.get("clientId");
    if(!clientId){
      return [];
    }
    return Clients.findOne({_id:clientId}).cards;
  },
  expDate : function(){
    var mom = moment(this.expirationDate);
    return mom.format("DD MMM YYYY");
  },
  reservations : function(){
    var clientId = Session.get("clientId");
    if(!clientId){
      return [];
    }
    var client = Clients.findOne({_id:clientId});
    return client.reservations;
  },
  selectCards : function(){
    var coach = Coaches.findOne();
    var coachId="";
    if(coach){coachId = coach._id;}
    return CoachCards.find().fetch();
  },
  cardName:function(){
    return Session.get('cardToEdit').name;
  },
  expirationDate: function(){
    var expDate = Session.get('cardToEdit').expirationDate;
    var mom = moment(expDate);
    return mom.format("YYYY-MM-DD");
  },
  attLeft : function(){
    return Session.get('cardToEdit').attendingsLeft;
  }
});

Template.coachingPanelClient.events({
  "click .btnReturn" : function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelClients'});
  },
  "click #deleteClient":function(event){
    event.preventDefault();
    var clientId=this._id;
    swal({
      title: "Êtes-vous certain(e) ?",
      text: "Suppression du client.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Effacer",
      cancelButtonText: "Annuler",
      closeOnConfirm: false,
    },
    function(){
        swal("Effacé!", "Le client a été effacé", "success");
        Meteor.call('removeClient', clientId);
    });
  },
  "click #updateClient" : function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelClientUpdate'});
  },
  "click .addCardToClient" : function(event){
    event.preventDefault();
    $('#modalAddCardToClient').openModal();
  },
  "click .editClientCard":function(event){
    event.preventDefault();
    var clientId=Session.get("clientId");
    Session.set('cardToEdit',this);
    $('#modalEditClientCard').openModal();
  },
  "click .deleteClientCard":function(event){
    event.preventDefault();
    var clientId=Session.get("clientId");
    var card = this;
    swal({
      title: "Êtes-vous certain(e) ?",
      text: "Suppression de la carte du client.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Effacer",
      cancelButtonText: "Annuler",
      closeOnConfirm: false,
    },
    function(){
        swal("Effacé!", "Le client a été effacé", "success");
        Meteor.call('removeClientCard', clientId, card);
    });
  },
  "submit #addCardToClient" : function(event){
    event.preventDefault();
    var cardId = event.target.selectCoachCards.value;

    var clientId = Session.get("clientId");
    var data = {
      card : cardId,
      createdAt : new Date()
    };
    Meteor.call('addCardToClient', clientId, data, function(err,res){
      if(err){
        console.log(err);
      } else {
        Materialize.toast('Carte octroyée !',4000,'rounded');
      }
    });
  },
  "submit #editClientCardForm" : function(event){
    event.preventDefault();
    var oldCard = Session.get('cardToEdit');
    var clientId = Session.get('clientId');

    var expDate = event.target.expDate.value;

    expDate = moment(expDate).valueOf();
    var attLeft = event.target.attendingsLeft.value;

    if(oldCard.expirationDate == expDate && oldCard.attendingsLeft == attLeft){
      $('#modalEditClientCard').closeModal();
      Materialize.toast('Modifications enregistrées.',4000,'rounded');
    } else {
      var newCard = oldCard;
      newCard.expirationDate=expDate;
      newCard.attendingsLeft=attLeft;
      Meteor.call('editClientCard',clientId,newCard,function(err,res){
        if(err){
          Materialize.toast('Problème rencontré, veuillez réessayer plus tard.', 4000, 'rounded');
        } else {
          $('#modalEditClientCard').closeModal();
          Materialize.toast('Modifications enregistrées.',4000,'rounded');
        }
      });
    }
  }
});

Template.coachingPanelCardInsert.events({
  "click .btnReturn" : function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelClients'});
  },
  "submit #addCoachingCard" : function(event,template){
    event.preventDefault();
    var t = event.target;

    var name = t.name.value;
    var maxAttendings = t.maxAttendings.value;
    var duration = t.duration.value;
    var price = t.price.value;

    var coach = Coaches.findOne();
    var coachId=coach._id;

    if(CoachCards.findOne({name:name})){
      Materialize.toast('Il y a déjà une carte avec ce nom !', 4000, 'rounded');
    }
    else {
      CoachCards.insert({
          name:name,
          duration:duration,
          price:price,
          maxAttendings:parseInt(maxAttendings),
          coachId:coachId,
      });

      t.name.value='';
      t.maxAttendings.value='';
      t.duration.value='';
      t.price.value='';
      BlazeLayout.render('coachingPanel', {content:'coachingPanelClients'});
    }
  },
});

Template.clientReservation.helpers({
  dateTime: function() {
    var lessonId = this.lessonId;
    var date = Lessons.findOne(lessonId).date;
    var mom = moment(date);
    return mom.format("ddd DD MMM, HH:mm");
  },
  title : function(){
    var lessonId = this.lessonId;
    var title = Lessons.findOne(lessonId).title;
    return title;
  }
});

Template.coachingPanelClientInsert.events({
  "submit #addCoachingClient" : function(event){
    event.preventDefault();

    var t = event.target;

    var firstName = t.firstName.value;
    var lastName = t.lastName.value;
    var email = t.email.value;
    var tel = t.tel.value;
    var coachId = Coaches.findOne()._id;

    if(!email){email="";}
    if(!tel){tel="";}

    var data = {
      firstName:firstName,
      lastName:lastName,
      email : email,
      tel : tel,
      coachId : coachId,
      createdAt : new Date (),
      updatedAt : new Date(),
    };

    Meteor.call('insertClient', data , function(err,res){
      if(err){
        console.log("erreur lors de l'insert d'un nouveau client : ",err);
      } else {
        Materialize.toast('Nouveau client ajouté',4000,'rounded');
        Session.set('clientId',res);
      }
    });

    t.firstName.value ="";
    t.lastName.value='';
    t.email.value='';
    t.tel.value='';

    BlazeLayout.render('coachingPanel', {content:'coachingPanelClients'});
  },
});

Template.coachingPanelClientUpdate.helpers({
  client : function(){
    var clientId = Session.get("clientId");
    if(!clientId){
      return [];
    }
    return Clients.findOne({_id:clientId});
  },
});

Template.coachingPanelClientUpdate.events({
  "click .btnReturn" : function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelClient'});
  },
  "submit #updateClientForm" : function(event,template){
    event.preventDefault();

    var t = event.target;

    var firstName = t.firstName.value;
    var lastName = t.lastName.value;
    var email = t.email.value;
    var tel = t.tel.value;

    var coachId = Coaches.findOne()._id;

    var data = {
      firstName:firstName,
      lastName:lastName,
      email : email,
      tel : tel,
      coachId : coachId,
      updatedAt : new Date()
    };

    var clientId = Session.get("clientId");

    Meteor.call('updateClient',clientId, data, function(err,res){
      if(err){
        console.log(err);
      } else {
        Materialize.toast('Client mis à jour.', 4000, 'rounded');
      }
    });

    BlazeLayout.render('coachingPanel', {content:'coachingPanelClient'});
  },
});

Template.coachingPanelLesson.helpers({
  lesson : function(){
    var lessonId = Session.get("lessonId");
    return Lessons.findOne({_id:lessonId});
  },
  dateTime: function(){
    var mom = moment(this.date);
    return mom.format("ddd DD MMM, HH:mm");
  }
});

Template.coachingPanelLesson.events({
  "click .btnReturn" : function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelLessons'});
  },
  "click .btnCancel" : function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelContact'});
    swal("Pas encore disponible !", "Cette fonctionnalité n'est pas encore disponible. Vous pouvez nous contacter afin que nous procédions à une annulation manuelle.");
  },
  "click .btnUpdate" : function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelContact'});
    swal("Pas encore disponible !", "Cette fonctionnalité n'est pas encore disponible. Vous pouvez nous contacter afin que nous procédions à une modification manuelle.");
  },
  "click .btnDuplicate" : function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelLessonDuplicate'});
  }
});


Template.coachingPanelAttendingList.helpers({
  attendees : function(){
    var lessonId = Session.get('lessonId');
    var lesson = Lessons.findOne({_id:lessonId});
    Meteor.subscribe('attendessListById',lesson.attendeesList);

    var aL = AttendeesList.findOne();
    var list = [];
    var b;
    for(var i = 0; i< aL.users.length; i++){
      if(aL.users[i].birthday){
        b=moment(aL.users[i].birthday);
        b=b.format("DD dddd YYYY");
      } else {
        b="Pas de date.";
      }

      list.push({
        type:"T",
        firstName:aL.users[i].firstName,
        lastName:aL.users[i].lastName,
        secondaryInfo:b,
        pricePaid:aL.users[i].pricePaid,
        createdAt:aL.users[i].createdAt,
      });
    }

    for(var i = 0; i< aL.nonUsers.length; i++){
      b=aL.nonUsers[i].email;
      list.push({
        type:"C",
        firstName:aL.nonUsers[i].firstName,
        lastName:aL.nonUsers[i].lastName,
        secondaryInfo:b,
        createdAt:aL.nonUsers[i].createdAt,
      });
    }
    return list;
  },
  isClient : function(){
    if(this.type==="C"){
      return true;
    } else {
      return false;
    }
  },
  isComing : function(){
    var lessonId = Session.get("lessonId");
    var lesson = Lessons.findOne({_id:lessonId});
    var date = new Date();
    var now = date.getTime() - 900000;
    if(lesson.date > now){
      return true;
    } else {
      return false;
    }
  }
});

Template.coachingPanelAttendingList.events({
  "click .cancelAttendee":function(event){
    event.preventDefault();
    var client = Clients.findOne({email:this.secondaryInfo});
    var clientId = client._id;
    var lessonId = Session.get("lessonId");
    var date = this.createdAt;

    var cards = client.cards;
    cards.sort(function(ca,cb){
      return ca.attendingsLeft-cb.attendingsLeft;
    });

    var fromCard=false;
    for(var i = 0; i<client.reservations.length;i++){
      if(client.reservations[i].lessonId == lessonId && client.reservations[i].createdAt.getTime() === date.getTime()){
        fromCard=client.reservations[i].fromCard;
      }
    }
    if(cards[0]){
      var cardData = {
        fromCard:fromCard,
        cardName:cards[0].name,
        expDate:cards[0].expirationDate,
      };
    } else {
      var cardData = {fromCard:fromCard};
    }

    swal({
      title: "Êtes-vous certain(e) ?",
      text: "Suppression de l'inscription.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Effacer",
      cancelButtonText: "Annuler",
      closeOnConfirm: true,
    },
    function(){
        Meteor.call('cancelNonUserAttendee',clientId,lessonId,date,cardData,function(err,res){
          if(err){console.log(err);}
        });
    });
  },
  "click .newAttendee" : function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelLessonInsertAttendees'});
  }
});


Template.coachingPanelLessonInsertAttendees.events({
  "click .btnReturn" : function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelLesson'});
  },
  "submit #newAttendee": function(event){
    event.preventDefault();

    var name=$("#autocomplete-input").val();
    var names = name.split(" ");
    var lastName = names[0];
    var firstName=names[1];
    for(var i=1;i<names.length;i++){
      if(names[i+1]){firstName += " "+names[i+1];}
    }
    var fromCard = event.target.fromCard.checked;
    var client = Clients.findOne({lastName:lastName,
                                  firstName:firstName,});
    if(!client){
      lastName = names[0] +" "+ names[1];
      firstName=names[2];
      for(var i=2;i<names.length;i++){
        if(names[i+1]){firstName += " "+names[i+1];}
      }
      client = Clients.findOne({lastName:lastName,
                                firstName:firstName,});
    }
    if(!client){
      lastName = names[0] +" "+ names[1]+" "+names[2];
      firstName=names[3];
      for(var i=3;i<names.length;i++){
        if(names[i+1]){firstName += " "+names[i+1];}
      }
      client = Clients.findOne({lastName:lastName,
                                firstName: firstName});
    }

    if(!client){
        Materialize.toast("Ce client n'existe pas.",4000,'rounded');
    } else {
      var data = {
                  clientId : client._id,
                  firstName : client.firstName,
                  lastName : client.lastName,
                  email : client.email,
                  fromCard : fromCard,
                  createdAt : new Date()
                };
        var lessonId = Session.get("lessonId");
        var lesson = Lessons.findOne({_id:lessonId});
        var aLId = lesson.attendeesList;
        Meteor.call('addNonUserAttendee',lessonId, aLId, data, function(err,res){
          if(err){
            console.log(err);
          } else {
            Materialize.toast('Client inscrit au cours.', 4000, 'rounded');
          }
        });

        if(fromCard){
          var cards = client.cards;
          cards.sort(function(ca,cb){
            return cb.attendingsLeft-ca.attendingsLeft;
          });
          if(cards[0]){
              if(parseInt(cards[0].attendingsLeft) > 0){
                Meteor.call('incrementCardOfClient', client._id, cards[0].name, cards[0].expirationDate, -1, function(err,res){
                  if(err){
                    console.log(err);
                  } else {
                    Materialize.toast('Carte du client mise à jour.', 4000, 'rounded');
                  }
                });
              } else {
                Materialize.toast('Aucune place restante sur les cartes du client', 4000, 'rounded');
              }
          } else {
            Materialize.toast("Ce client n'a aucune carte !", 4000, 'rounded');
          }
        }

      }
  },
});

Template.coachingPanelLessons.onRendered(function(){
  Session.set('limitCoachLessons', 3);
});

Template.coachingPanelLessons.helpers({
  comingLess: function(){
    var lim = Session.get('limitCoachLessons');
    if(!Accounts.user()){ return [];}
    var coachEmail =Accounts.user().emails[0].address;
    var dateNow = new Date();
    var now = dateNow.getTime();
    var l = Lessons.find({coachEmail:coachEmail,
                          date:{$gt:now}
                        },{sort : {date : 1},
                          limit : lim});
    if(l){
      return l;
    }
    else {
      return [];
    }
  },
  pastLess: function(){
    var lim = Session.get('limitCoachLessons');
    if(!Accounts.user()){ return [];}
    var coachEmail =Accounts.user().emails[0].address;
    var dateNow = new Date();
    var now = dateNow.getTime() + 5400000;
    var l = Lessons.find({coachEmail:coachEmail,
                          date:{$lt:now}
                        },{sort : {date : 1},
                          limit : lim});
    if(l){
      return l;
    }
    else {
      return [];
    }
  },
  moreComingLess: function(){
    var lim = Session.get('limitCoachLessons');
    if(!Accounts.user()){ return false;}
    var coachEmail=Accounts.user().emails[0].address;
    var dateNow = new Date();
    var now = dateNow.getTime();
    var l = Lessons.findOne({coachEmail:coachEmail,
                          date:{$gt:now}
                        },{sort : {date : 1},
                          skip : lim});
    if(l){
      return true;
    } else {
      return false;
    }
  },
  morePastLess: function(){
    var lim = Session.get('limitCoachLessons');
    if(!Accounts.user()){ return false;}
    var coachEmail =Accounts.user().emails[0].address;
    var dateNow = new Date();
    var now = dateNow.getTime();
    var l = Lessons.findOne({coachEmail:coachEmail,
                          date:{$lt:now}
                        },{sort : {date : 1},
                          skip : lim});
    if(l){
      return true;
    } else {
      return false;
    }
  }
});

Template.coachingPanelLessons.events({
  "click .loadMore" : function(event){
    event.preventDefault();
    var i = Session.get("limitCoachLessons");
    Session.set('limitCoachLessons',i+3 );
  },
  "click .newLesson" : function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelLessonInsert'});
  },
  "click .btnProblem" : function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelContact'});
  }
});

Template.coachingPanelLessonInsert.events({
  "click .btnReturn" : function(event){
    event.preventDefault();
    BlazeLayout.render('coachingPanel', {content:'coachingPanelLessons'});
  },
  "submit #insertLessonByCoach" : function(event){
    event.preventDefault();
     var t=event.target;

     var title=t.title.value;
     var shortDesc=t.shortDesc.value;
     var longDesc = t.longDesc.value;
     var duration = t.duration.value;
     var category = t.category.value;
     var coachEmail = Coaches.findOne().email;
     var street = t.street.value;
     var zip = t.zip.value;
     var city = t.city.value;
     var instructions = t.instructions.value;
     var maxAttendees = t.maxAttendees.value;
     var price=t.price.value;
     var date = t.date.value;
     var time = t.time.value;
     var repeat = t.recurrent.checked;

     var attendeesList = "";

     //Composition of the address
     var address = street+" , "+zip+" "+city;
     //Date in milliseconds since 1st january 1970
     var d = new Date(date+" "+time);
     var dateInMilli = d.getTime();

     //Pricing
     var commission=0.25;
     commission += price*0.15;

     maxAttendees= parseInt(maxAttendees);

     if(GoogleMaps.loaded()){
         var geocoder = new google.maps.Geocoder();
         var results = geocoder.geocode({'address': address}, function(results, status){
           if(status === google.maps.GeocoderStatus.OK){
               coord=results[0].geometry.location;
               lat = coord.lat();
               lng = coord.lng();
               loc = {
                 type:"Point",
                 coordinates:[
                   lng,
                   lat
                 ]
               };
               Session.set('loc',loc);
             } else {
               console.log("Problem with the geocoder : " + status);
             }
           });
     } else {
       console.log("error with GoogleMaps");
       loc = {
         type:"Point",
         coordinates:[
           4.371,
           50.843
         ]
       };
       Session.set('loc',loc);
     }

     var r=0;
     if(repeat){
       r=5;
     }

     var image = document.getElementById('photo').files[0];
     var reader = new FileReader();

     var imgUrl = "";
     if(image){
     reader.onloadend=function(e){
       const data = new FormData();
       data.append('file', e.target.result);
       data.append('upload_preset', "el9jd7os");
       var url ="https://api.cloudinary.com/v1_1/trys/image/upload";
       var xhr = new XMLHttpRequest();

       //var params="file="+ e.target.result +"&upload_preset=el9jd7os";//This preset automatically add the image in Lessons folder & reduce the quality
       xhr.open("POST", url, true);
       xhr.onreadystatechange=function(){
         if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
           var response = JSON.parse(xhr.responseText);
           console.log("response :", response);
           imgUrl=response.secure_url;
           console.log(response);

               var location = Session.get('loc');
               var d = dateInMilli;
                for(var i = 0; i<=r;i++){
                  d = dateInMilli + i*604800000;
                  var toInsert={
                    imgUrl:imgUrl,
                    title:title,
                    shortDesc:shortDesc,
                    longDesc:longDesc,
                    duration:duration,
                    category:category,
                    coachEmail:coachEmail,
                    address:address,
                    instructions:instructions,
                    geospatial:location,
                    maxAttendeesLeft:maxAttendees,
                    price:price,
                    commission:commission,
                    date:d,
                    attendeesList:attendeesList,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  };

                  Meteor.call("insertLessonByCoach", toInsert, (err,res)=>{
                   if(res){
                     Materialize.toast('Cours enregistré avec succès !', 4000,'rounded');
                   } else {
                     Materialize.toast("Erreur lors de l'insertion: "+err, 4000,'rounded');
                   }
                  });
                }


                t.maxAttendees='';
                t.price.value='';
                t.date.value='';
                t.time.value='';
         }

       };
       xhr.send(data);

     }
     reader.readAsDataURL(image);
   } else {
     Materialize.toast("Informations incomplètes, veuillez réessayer.", 4000, 'rounded');
   }
  }
});

Template.coachingPanelLessonDuplicate.helpers({
  lesson : function(){
    var lessonId = Session.get('lessonId');
    return Lessons.findOne({_id:lessonId});
  }
});

Template.coachingPanelLessonDuplicate.events({
    "click .btnReturn" : function(event){
      event.preventDefault();
      BlazeLayout.render('coachingPanel', {content:'coachingPanelLesson'});
    },
    "submit #insertLessonByCoach" : function(event){
      event.preventDefault();
       var t=event.target;
       var lessonId = Session.get('lessonId');
       var lesson = Lessons.findOne(lessonId);

       var duration = t.duration.value;
       var instructions = t.instructions.value;
       var maxAttendees = t.maxAttendees.value;
       var price=t.price.value;
       var date = t.date.value;
       var time = t.time.value;
       var repeat = t.recurrent.checked;

       //Date in milliseconds since 1st january 1970
       var d = new Date(date+" "+time);
       var dateInMilli = d.getTime();

       //Pricing
       var commission=0.25;
       commission += price*0.15;

       maxAttendees= parseInt(maxAttendees);

       var r=0;
       if(repeat){
         r=5;
       }


      var d = dateInMilli;

      var toInsert = lesson;
      delete toInsert._id;
      toInsert.date=d;
      toInsert.duration=duration;
      toInsert.maxAttendeesLeft=maxAttendees;
      toInsert.price=price;
      toInsert.commission=commission;
      toInsert.createdAt=new Date();
      toInsert.updatedAt=new Date();
      toInsert.instructions = instructions;
      for(var i = 0; i<=r;i++){
        d = dateInMilli + i*604800000;
        toInsert.date = d;

        Meteor.call("insertLessonByCoach", toInsert, (err,res)=>{
         if(res){
           Materialize.toast('Cours enregistré avec succès !', 4000,'rounded');
         } else {
           Materialize.toast("Erreur lors de l'insertion: "+err, 4000,'rounded');
         }
        });
      }

      t.date.value='';
      t.time.value='';
     }
});
Template.coachingPanelContact.events({
  "submit form": function(event, template){
     event.preventDefault();
     var t=event.target;
     var email = Coaches.findOne().email;
     var firstName = UserProfiles.findOne({email:email}).firstName;
     var lastName = UserProfiles.findOne({email:email}).lastName;
     var subject = "[COACH]" + t.subject.value;
     var message = t.comments.value;

     var mail =  "Nom : "+lastName+"<br>"
               +"Prénom : "+firstName+"<br>"
               +"Email : "+email+"<br>"
               +"Message : "+message+"<br>";

     Meteor.call('sendMail', 'contact@trys.be', email, subject, mail,(err,res)=>{
       if(res){
         t.subject.value='';
         t.comments.value='';

         Materialize.toast("Message envoyé ! Nous vous recontacterons le plus vite possible.", 4000, 'rounded');
       }
       else {
         Materialize.toast("Il y a un problème avec le serveur. Réessayez plus tard.", 4000, 'rounded');
       }
     });
  }
});
