if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  Session.setDefault('testStatus', 'false');
  Session.setDefault('authStatus', 'false');

  Template.counter.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.test.helpers({
    testStatus: function () {
      return Session.get('testStatus');
    },
    authStatus: function() {
      return Session.get('authStatus');
    }
  });

  Template.test.events({
    'click button': function () {
      Meteor.call("testApi", function(error, result) {
        Session.set('testStatus', result.ok.toString());
      });
      Meteor.call("testAuth", function(error, result) {
        Session.set('authStatus', result.ok.toString());
      });
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.channels.created = function () {
    Meteor.call("getChannels", function(error, result) {
      console.log("result", result);
      Session.set('channels', result.channels);
    });
  }

  Template.channels.helpers({
    channels: function () {
      return Session.get('channels');
    }
  });

  Template.music.created = function() {
    Meteor.call("getHistory", function(error, result) {
      console.log("getHistory result", result);
      Session.set('jams', result);
    });
  }

  Template.music.helpers({
    jams: function () {
      return Session.get('jams');
    }
  });

  Template.registerHelper("prettifyDate", function(timestamp) {
    var d = new Date(0);
    d.setUTCSeconds(timestamp);
    var hours = d.getHours();
    var mins = d.getMinutes();
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    return month + "/" + day + "/" + year + " " + hours + ":" + mins;
  });
}

if (Meteor.isServer) {
  var token = process.env.STOKEN;
  var channel_name = process.env.SCHANNEL;
  var channel_id = null;
  Channels = new Mongo.Collection(null);

  Meteor.startup(function () {
    // code to run on server at startup
    console.log("Starting app");
    console.log("Channel: ", channel_name);
    Meteor.call('cacheChannels');
    channel_id = Meteor.call('getChannelId', channel_name);
  });

  Meteor.methods({
    testApi: function() {
      try {
        return SlackAPI.api.test();
      } catch (e) {
        console.log(e);
      }
    },
    testAuth: function() {
      try {
        return SlackAPI.auth.test(token);
      } catch (e) {
        console.log(e);
      }
    },
    getChannelId: function(channel_name) {
      var found = Channels.findOne({'name': channel_name});
      return found.id;
    },
    cacheChannels: function() {
      var channels = SlackAPI.channels.list(token).channels;
      for (index in channels) {
        _channel = Channels.insert(channels[index]);
      }
    },
    getHistory: function() {
      history = SlackAPI.channels.history(token, channel_id);
      console.log("History retrieved");
      var redacted = [];
      for (message in history.messages) {
        message = history.messages[message];
        if (message.attachments) {
          for (i in message.attachments) {
            attachment = message.attachments[i]
            if (attachment.thumb_url) {
              attachment.usable_image = attachment.thumb_url;
            } else {
              attachment.usable_image = attachment.image_url;
            }
            attachment.time = message.ts;
            attachment.user = SlackAPI.users.info(token, message.user);
          }
          redacted.push(message);
        }
      }
      return redacted;
    }
  });
}
