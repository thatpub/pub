'use strict';

const express = require("express");
const app = express();
const cmd = require("child_process").spawn;

app.post('/git', ( req, res ) => {
    if ( !req.headers[ "x-hub-signature" ] ) {
        console.log(`Failed attempt to access the /git URL at ${new Date()}`, req.headers);
        res.end();
        return false;
    }

    console.log(`git stash and pull ran at ${new Date()}`);
    cmd('git', [ 'stash' ]);

    const git = cmd('git', [ 'pull', '--all' ]);
    git.stdout.on("data", console.log);
    console.log(`build ran at ${new Date()}`);

    const grunt = cmd('npm', [ 'run', 'init' ]);
    grunt.stdout.on("data", console.log);
    res.end();
});

app.listen(9787);
