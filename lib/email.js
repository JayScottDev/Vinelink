const request = require('request-promise');

const templates = {
  logs_export: 'fe061851-8399-40ed-b544-995e9f805d85',
  order_cancel_failure: 'ab46ec8a-4468-4e7d-88cd-8d6fa062d422'
};

module.exports.sendEmail = async (options) => {
  try {
    const { to_email, to_name, type, params } = options;
    for (let key in params) {
      params[`%${key}%`] = params[key];
      delete params[key];
    }

    const resp = await request({
      resolveWithFullResponse: true,
      json: true,
      headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}` },
      uri: 'https://api.sendgrid.com/v3/mail/send',
      method: 'POST',
      body: {
        template_id: templates[type],
        personalizations: [{
          to: [{
            email: to_email,
            name: to_name
          }],
          substitutions: params
        }],
        from: {
          email: 'hello@grapevine.com',
          name: 'Vinelink'
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
};
