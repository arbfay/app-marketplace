Meteor.startup(() => {
  // code to run on server at startup
  process.env.MAIL_URL = "smtp://postmaster%40trys.be:0af09a360291c3e99a82237a4f9efef0@smtp.mailgun.org:587";

  //Trombone.configure('c5MZwh9iAbQESwrFA', 'XXd_vXXkCQPLrvblTxNpkn5jII91uIUPtztcjQq6W5U', 'anticonard');
});
