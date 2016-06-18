'use strict';

const express = require("express");
const app = express();
const cmd = require("child_process").spawn;

app.post('/git', function ( req, res ) {
    if ( !req.headers[ "x-hub-signature" ] ) {
        console.log(`Failed attempt to access the /git URL at ${new Date()}`, req.headers);
        res.end();
        return false;
    }
    console.log(`git stash and pull ran at ${new Date()}`);
    cmd('git', [ 'stash' ]);
    const git = cmd('git', [ 'pull', '--all' ]);
    git.stdout.on("data", function ( data ) {
        console.log(`${data}`);
    });
    console.log(`npm install ran at ${new Date()}`);
    const npm = cmd('npm', [ 'install' ]);
    npm.stdout.on("data", function ( data ) {
        console.log(`${data}`);
    });
    console.log(`bower install ran at ${new Date()}`);
    const bower = cmd('bower', [ 'install', '--force' ]);
    bower.stdout.on("data", function ( data ) {
        console.log(`${data}`);
    });
    console.log(`build ran at ${new Date()}`);
    const grunt = cmd('npm', [ 'run', 'build' ]);
    grunt.stdout.on("data", function ( data ) {
        console.log(`${data}`);
    });
    res.end();
});

app.listen(9787);
