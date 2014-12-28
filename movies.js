// Collection to store movies to be displayed
Movies = new Mongo.Collection("movies");

// Code that only runs on the client
if (Meteor.isClient) {
	Meteor.subscribe("movies");

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

	Template.movie.helpers({
		isOwner: function () {
			return this.owner === Meteor.userId();
		}
	});

	// Event functions
	Template.body.events({
		// Called when we submit a new movie
		"submit .new-movie": function (event) {
			var title = event.target.text.value;
			// Insert movie into Mongo
			Meteor.call("addMovie")
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
			Meteor.call("setChecked", this._id, ! this.checked);
		},
		"click .delete": function () {
			Meteor.call("deleteMovie", this._id);
		},
		"click .toggle-private": function () {
			Meteor.call("setPrivate", this._id, ! this.private);
		}
	});

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});
}

if (Meteor.isServer) {
  Meteor.publish("movies", function () {
  	return Movies.find({
  		$or: [
  			{ private: {$ne: true} },
  			{ owner: this.userId }
  		]
  	});
  });
}

Meteor.methods({
	addMovie: function (text) {
		// Ensure user is logged in before adding a movie
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Moavies.insert({
			title: title,
			createAt: new Date(), 						// current time
			owner: Meteor.userId(),						// _id of logged in user
			username: Meteor.user().username 	// username of logged in user
		});
	},
	deleteMovie: function (movieId) {
		var movie = Movies.findOne(movieId);
		if (movie.private && movie.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Movies.remove(movieId);
	},
	setChecked: function (movieId, setChecked) {
		var movie = Movies.findOne(movieId);
		if (movie.private && movie.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Movies.update(movieId, { $set: { checked: setChecked} });
	},
	setPrivate: function (movieId, setToPrivate) {
		var movie = Movies.findOne(movieId);
		// Ensure only a movie ower can make a movie private
		if (movie.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Movies.update(movieId, { $set: { private: setToPrivate } });
	}
});