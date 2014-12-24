// Collection to store movies to be displayed
Movies = new Mongo.Collection("movies");

// Code that only runs on the client
if (Meteor.isClient) {

	// Helper functions
	Template.body.helpers({
		movies: function() {
			return Movies.find({}, {sort: {createAt: -1}}); // Sort most recent at the top
		}
	});

	// Event functions
	Template.body.events({
		// Called when we submit a new movie
		"submit .new-movie": function (event) {
			var title = event.target.text.value;
			// Insert movie into Mongo
			Movies.insert({
				title: title,
				createAt: new Date() // current time
			});
			// Clear form
			event.target.text.value = "";
			// Prevent default form submit
			return false;
		}
	})
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
