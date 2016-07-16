'use strict';

const request = require('request');
const superagent = require('superagent');

const feathers = require('feathers/client');
const rest = require('feathers-rest/client');
const hooks = require('feathers-hooks');
const authentication = require('feathers-authentication/client');

class Api {
  // initialise api and do authentication
  constructor(uri, username, password) {
    this.uri = uri;
    this.token;
    this.username = username;
    this.password = password;
    const app = feathers()
      .configure(hooks())
      .configure(rest(uri).request(request))
      .configure(authentication());
    app.authenticate({
      type: 'local',
      'email': username,
      'password': password
    }).then(result => {
      this.token = app.get('token');
      return this;
    }).catch(error => {
      console.log(error);
    });
  }

  postPin(json, callback) {
    request(
        {
          uri: this.uri + '/pins',
          method: 'POST',
          json: json,
          headers: {'Content-Type': 'application/json'},
          auth: {'Bearer': this.token}
        },
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            callback(body);
          } else {
            console.error('Unable to upload an image.');
            console.error(response);
            console.error(error);
          }
        }
      );
    /*superagent
      .post(this.uri + '/pins')
      .set('Authorization', 'Bearer ' + this.token)
      .send(json)
      .end(function(error, response) {
        if (!error && response.statusCode == 200) {
          callback(response.body);
        } else {
          console.error('Unable to post a new pin.');
          console.error(response);
          console.error(error);
        }
      });*/
  }

  uploadPhotoFromURL(imgLink, callback) {
    request(
        {
          uri: this.uri + '/photos/uploadfromurl',
          method: 'POST',
          json: imgLink,
          headers: {'Content-Type': 'application/json'}
        },
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            callback(body);
          } else {
            console.error('Unable to upload an image.');
            console.error(response);
            console.error(error);
          }
        }
      );
  }
};

module.exports = Api;
