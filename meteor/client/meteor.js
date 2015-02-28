  Router.map(function() {
  this.route('pitch', {path:'/'});
  this.route('newCostumer', {path: '/registro'});
  }
  );

  Template.pitch.events({

    'click button': function () {
      Router.go('newCostumer');
    }
  });
