// Collection to store movies to be displayed
Movies = new Mongo.Collection("movies");

// Code that only runs on the client
if (Meteor.isClient) {

	// Helper functions
	Template.body.helpers({
		movies: function() {
			if (Session.get("hideWatched")) {
				// If hide watched is checked, hide watched movies; $ne is not equal in MongoDB
				return Movies.find({checked: {$ne: true}}, {sort: {createAt: -1}});
			} else {
				// Otherwise return all movies
				return Movies.find({}, {sort: {createAt: -1}}); // Sort most recent at the top
			}
		},
		hideCompleted: function () {
			return Session.get("hideCompleted");
		},
		unwatchedCount: function () {
			return Movies.find({checked: {$ne: true}}).count();
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
		},
		"change .hide-watched input": function (event) {
			Session.set("hideWatched", event.target.checked);
		}
	});

	Template.movie.events({
		"click .toggle-checked": function () {
			// Set the checked property to the opposite of its current value
			Movies.update(this._id, {$set: {checked: ! this.checked}});
		},
		"click .delete": function () {
			Movies.remove(this._id);
		}
	});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
