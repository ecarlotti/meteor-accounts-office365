import { _ } from 'meteor/underscore';

/* globals Office365 */
Accounts.oauth.registerService('office365');

if (Meteor.isClient) {
  const loginWithOffice365 = function(options, callback) {
    if (! callback && typeof options === 'function') {
      callback = options;
      options = null;
    }

    if (typeof Accounts._options.restrictCreationByEmailDomain === 'string') {
      options = _.extend({}, options || {});
      options.loginUrlParameters = _.extend({}, options.loginUrlParameters || {});
      options.loginUrlParameters.hd = Accounts._options.restrictCreationByEmailDomain;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);      
    Office365.requestCredential(options, credentialRequestCompleteCallback);
  };

  Accounts.registerClientLoginFunction('office365', loginWithOffice365);

  Meteor.loginWithOffice365 = function() {
    return Accounts.applyLoginFunction('office365', arguments);
  };
} else {

  const Microsoft = {

    serviceName: 'office365',
    // https://msdn.microsoft.com/en-us/library/office/dn659736.aspx
    whitelistedFields: ['id', 'displayName', 'givenName', 'surname', 'username', 'mail', 'preferredLanguage', 'jobTitle', 'mobilePhone', 'userPrincipalName'],

  };

  /**
     If autopublish is on, publish these user fields. Login service
    packages (eg accounts-google). Notably, this isn't implemented with
    multiple publishes since DDP only merges only across top-level
    fields, not subfields (such as 'services.microsoft.accessToken')
  */
  Accounts.addAutopublishFields({

    forLoggedInUser: _.map(
        // publish access token since it can be used from the client
        Microsoft.whitelistedFields.concat(['accessToken', 'expiresAt']), // don't publish refresh token
        function (subfield) { return 'services.office365.' + subfield; }),

    forOtherUsers: _.map(
        // even with autopublish, no legitimate web app should be
        // publishing all users' emails
        _.without(Microsoft.whitelistedFields, ['mobilePhone', 'jobTitle', 'officeLocation', 'businessPhones']),
        function (subfield) { return 'services.office365.' + subfield; })
  });  

  // Original code - Too simple and insecure for what we intend to do...
  // Accounts.addAutopublishFields({
  //   forLoggedInUser: ['services.office365'],
  //   forOtherUsers: ['services.office365.mail']
  // });
}
