Template.reservationRecap.events({
  "click .myProfile" (event) {
    event.preventDefault();

    FlowRouter.go('/profile');
  }
});
