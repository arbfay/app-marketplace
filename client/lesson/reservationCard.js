Template.reservationCard.events({
  "click #reservation" (event) {
    event.preventDefault();

    //Create a reservation that is not complete
    var userId = Meteor.userId();
    if(userId === null){
      FlowRouter.go('/login');
    }
    var userMail = Accounts.user().emails[0].address;
    Meteor.subscribe("userProfileByMail", userMail);

    var userProfile = UserProfiles.findOne({email:userMail});

    var userProfileId = userProfile._id;

    var lessons = Lessons.find().fetch();
    var selection = Session.get('selectedDate');
    var lesson = lessons[selection.select];
    var lessonId = lesson._id;
    var coachId= lesson.coachId;

    if(lesson && userId && userProfileId){
      var toInsert = {
        userId:userId,
        userProfileId :userProfileId,
        lessonId : lessonId,
        lessonTitle:lesson.title,
        lessonDate:lesson.date,
        lessonTime:lesson.time,
        lessonMoment:lesson.moment,
        coachId : coachId,
        isComplete:false,
        isPaid:false,
        createdAt : new Date(),
        updatedAt : new Date(),
      };
      Meteor.call('insertReservation', toInsert, function(err,res){
        if(err){
          Materialize.toast("Erreur lors de l'insertion d'une réservation",4000,'rounded');
        } else{
          FlowRouter.go('/class/:lessonId/:reservationId',{lessonId:lessonId,
                                                          reservationId:res},{});
        }
      });

    } else {
      //FlowRouter.go('/');
    }

  },
});
