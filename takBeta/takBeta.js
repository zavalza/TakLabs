Router.map(function() {
  this.route('welcome', {path: '/'});
  this.route('loginForm', {path: '/login'});
  this.route('newUserForm', {path: '/newUser'});
});


if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to takBeta.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
