'use strict';

module.exports.addSCCredentials = async (ctx, next) => {
  const username = ctx.req.body.username;
  const password = ctx.req.body.password;

  //add user ship compliant creditials to db, still needs encryption

  const queryConfig = {
    text: 'INSERT INTO client_info (store_name, username, password) VALUES ($1, $2, $3',
    values: [app.get('shop'), username, password],
  };

  client.query(queryConfig, async function (err, result) {
    if (err) {
      throw err;
      ctx.res.status(500).end();
    }
    console.log(result);
    await ctx.res.redirect('/compliancy-connector');
  });
};
