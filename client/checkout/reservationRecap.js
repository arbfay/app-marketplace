Template.reservationRecap.helpers({
  timeFromNow : function(){
    var reservationId = FlowRouter.getParam('reservationId');
    Meteor.subscribe("reservationById",reservationId);
    var reservation = Reservations.findOne();

    var d = new Date(reservation.lessonDate);
    var mom = moment(d);
    return mom.fromNow();
  },
  addressToString : function(){
    var reservation = Reservations.findOne();

    var lessonId = reservation.lessonId;
    Meteor.subscribe("matchingLesson", lessonId);
    var lesson=Lessons.findOne();
    return lesson.address;
  }
})

Template.reservationRecap.events({
  "click .myProfile" (event) {
    event.preventDefault();

    FlowRouter.go('/profile');
  }
});
