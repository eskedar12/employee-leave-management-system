const { login } = require('./src/controllers/authController');
const { User, sequelize } = require('./src/models');
(async () => {
  try {
    await sequelize.authenticate();
    const username = 'john';
    const password = 'john123';
    const user = await User.findOne({ where: { username } });
    console.log('FOUND USER', user ? user.toJSON() : null);
    if (user) {
      const manual = await user.comparePassword(password);
      console.log('COMPARE MANUAL', manual);
    }
    const req = { body: { username, password } };
    let status = 200;
    const res = {
      status: (code) => { status = code; return res; },
      json: (body) => { console.log('LOGIN RES', status, JSON.stringify(body)); }
    };
    await login(req, res);
  } catch (err) {
    console.error('ERROR', err);
  } finally {
    await sequelize.close();
  }
})();
