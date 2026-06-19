const sequelize = require('../src/config/database');

(async () => {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('Connected to DB');

    const qi = sequelize.getQueryInterface();
    const desc = await qi.describeTable('users');
    // eslint-disable-next-line no-console
    console.log('users table description:');
    // eslint-disable-next-line no-console
    console.dir(desc, { depth: null });
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error describing users table:', err);
    process.exit(1);
  }
})();
