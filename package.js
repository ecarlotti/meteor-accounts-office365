Package.describe({
  name: 'ecarlotti:accounts-office365',
  version: '0.1.2',
  summary: 'Login service for Microsoft Office 365 accounts',
  git: 'https://github.com/ecarlotti/meteor-accounts-office365',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.5.1');

  api.use('ecmascript');

  api.use('accounts-base@2.0.0', ['client', 'server']);
  api.imply('accounts-base@2.0.0', ['client', 'server']);

  api.use('accounts-oauth', ['client', 'server']);

  api.use('ecarlotti:office365-oauth@0.2.0');
  api.imply('ecarlotti:office365-oauth@0.2.0');

  api.use(
    ['accounts-ui'],
    ['client', 'server'],
    { weak: true }
  );
  api.addFiles('office365.js', ['client', 'server']);
  api.addFiles('login_button.css', 'client');
});
