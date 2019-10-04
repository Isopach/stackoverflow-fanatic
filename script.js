/* jshint node: true */
/* global: casper */
"use strict";

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs('node_modules/casperjs/bin/bootstrap.js');

var LOGIN_URLS = [
    'https://stackoverflow.com/users/login',
    'https://meta.stackoverflow.com/users/4420129',
    'https://gaming.stackexchange.com/users/login/',
    'https://gaming.meta.stackexchange.com/users/100465',
    'https://japanese.stackexchange.com/users/login/',
    'https://japanese.meta.stackexchange.com/users/9861/',
    'https://security.stackexchange.com/users/login/',
    'https://security.meta.stackexchange.com/users/169503',
    'https://area51.stackexchange.com/users/login/',
    'https://chinese.stackexchange.com/users/login/',
    'https://chinese.meta.stackexchange.com/users/12131',
    'https://webapps.stackexchange.com/users/login/',
    'https://webapps.meta.stackexchange.com/users/107705/yuu',
    'https://meta.stackexchange.com/users/login/',
    'https://softwareengineering.stackexchange.com/users/login/',
    'https://softwareengineering.meta.stackexchange.com/users/317477',
    'https://travel.stackexchange.com/users/login/',
    'https://travel.meta.stackexchange.com/users/54667',
    'https://chess.stackexchange.com/users/login/',
    'https://chess.meta.stackexchange.com/users/15402',
    'https://codegolf.stackexchange.com/users/login/',
    'https://codegolf.meta.stackexchange.com/users/63257',
    'https://superuser.com/users/login/',
    'https://meta.superuser.com/users/530249',
    'https://ja.stackoverflow.com/users/login/',
    'https://ja.meta.stackoverflow.com/users/19906',
    
];
var start = +new Date();

var casper = require('casper').create({
    exitOnError: true,
    pageSettings: {
        loadImages: false,
        loadPlugins: false
    }
});

var email = casper.cli.get(0);
var password = casper.cli.get(1);

casper.echo('Today: ' + new Date());

if (!email || !password || !(/@/).test(email)) {
    casper.die('USAGE: casperjs stackoverflow-fanatic.js <email> <password> --ssl-protocol=any', 1);
} else {
    casper.echo('Loading login page');
}
casper.start()
    .each(LOGIN_URLS, function (casper, link) {
        if(LOGIN_URLS.indexOf(link)===0){

            casper.thenOpen(link, function () {
                this.echo('Logging in using email address ' + email +
                    ' and password ' + (new Array(password.length + 1)).join('*'));
                this.fill('#login-form', {email: email, password: password}, true);
            });

            casper.wait(500);

            casper.then(function () {
                if (this.getCurrentUrl().indexOf(link) === 0) {
                    this.die('Could not log in. Check your credentials.');
                } else {
                    this.echo('Clicking profile link');
                    this.click('.my-profile');
                    this.then(function () {
                        this.echo('User ' + this.getCurrentUrl().split('/').reverse()[0] + ' logged in!' +
                            '\nTook ' + (((+new Date()) - start) / 1000) + 's');
                    });
                }
            });
        }else{
            casper.thenOpen(link, function () {
                this.echo(link+' visited');
            });
        }
    });


casper.run();
