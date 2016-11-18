Template.reservationCard.events({
  "click #reservation" (event) {
    event.preventDefault();

    //Create a reservation that is not complete
    var userId = Meteor.userId();
    var userMail = Accounts.user().emails[0].address;
    var userProfile = UserProfiles.findOne({email:userMail});


    var userProfileId = userProfile._id;
    var lessonId = FlowRouter.getParam('lessonId');
    var lesson = Lessons.findOne(lessonId);
    var coachId= lesson.coachId;

    if(lesson && userId && userProfileId){
      var resId = Reservations.insert({
        userId:userId,
        userProfileId :userProfileId,
        lessonId : lessonId,
        lessonTitle:lesson.title,
        lessonDate:lesson.date,
        lessonTime:lesson.time,
        coachId : coachId,
        isComplete:false,
        isPaid:false,
        createdAt : new Date(),
        updatedAt : new Date(),
      });
      console.log(resId);
      //Use the id of the reservation to go to resConfirmation
      FlowRouter.go('/class/:lessonId/:reservationId',{lessonId:lessonId,
                                                      reservationId:resId,},{});
    } else {
      FlowRouter.go('/');
    }

  },
});
