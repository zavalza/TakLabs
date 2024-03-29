//MongoDB
Impulses = new Meteor.Collection("impulses");
Projects = new Meteor.Collection("projects");
People =  new Meteor.Collection("people");
Tags = new Meteor.Collection("tags");

//File Storage in MongoDb using FS
var imageStore = new FS.Store.GridFS("images");
Images = new FS.Collection("images", {
  stores: [imageStore],
  filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
});

//Iron Router configuration, specify which templates are loaded under which path
Router.map(function() {
  this.route('welcome', {path: '/'});
  this.route('loginForm', {path: '/entrar'});
  this.route('newUserForm', {path: '/registro'});
  this.route('newProject', {path:'/nuevaIdea'});
  this.route('newImpulse',{path:'/nuevoImpulso',
      waitOn: function() 
  { 
    Session.set('selectedTags',[]);
    return Meteor.subscribe('allTags')},
  });
  this.route('editImpulse',{path:'/editarImpulso/:_id',
      waitOn: function() 
  { 
    Session.set('currentImpulse',this.params._id);
    return Meteor.subscribe('allTags')},
  });
  this.route('news', {path: '/noticias'});
  this.route('firstLogin', {path: '/bienvenido'});
  this.route('projects', {path: '/proyectos',
    waitOn: function() 
  { 
    Session.set('filters',[]);
    return Meteor.subscribe('allCompanies')},
  });
  this.route('faqs', {path: '/dudas'});
  this.route('challenges', {path: '/retos',
    waitOn: function() 
  { 
    Session.set('filters',[]);
    return Meteor.subscribe('allImpulses')},
  });
  this.route('people', 
  {path: '/personas',
  waitOn: function() 
  { 
    Session.set('filters',[]);
    return Meteor.subscribe('allRegistredPeople')},
  });
  this.route('editProject', {path: '/editarIdea'});
  this.route('editProfile', {path: '/editarPerfil'});
  this.route('profile', 
    {path: '/:url',
    waitOn: function()
    { 
      Session.set('screenshotToShow', null);
      Session.set("url", this.params.url);
      return Meteor.subscribe('personUrl', this.params.url);
    }
    });
});
