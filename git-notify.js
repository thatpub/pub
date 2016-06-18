var express = require("express"),
  app = express(),
  cmd = require("child_process").spawn;

app.post('/git', function(req, res) {
  var git;
  if (!req.headers["x-hub-signature"]) {
    console.warn(`Failed attempt to access the /git URL at ${new Date()}`, req.headers);
    res.end();
    return false;
  }
  git = cmd('git', ['pull', '-u', 'origin', 'master']);
  console.log(new Date());
  git.stdout.on("data", function(data) {
    console.log("" + data);
  });
  res.end();
});

app.listen(9787);
