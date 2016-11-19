import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  process.env.MAIL_URL = "<Our URL here>";
});
