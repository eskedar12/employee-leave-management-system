const { login } = require('./src/controllers/authController');
const { sequelize } = require('./src/models');
(async () => {
  try {
    await sequelize.authenticate();
    const req = { body: { username: 'john', password: 'john123' } };
    let status = 200;
    const res = {
      status: (code) => { status = code; return res; },
      json: (data) => {
        console.log('STATUS', status);
        console.log('BODY', JSON.stringify(data, null, 2));
      },
    };
    await login(req, res);
  } catch (err) {
    console.error('ERROR', err);
  } finally {
    await sequelize.close();
  }
})();
