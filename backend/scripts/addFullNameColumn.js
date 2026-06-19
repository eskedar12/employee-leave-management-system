const sequelize = require('../src/config/database');

(async () => {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('Connected to DB');

    const qi = sequelize.getQueryInterface();
    const cols = await qi.describeTable('users');

    if (cols.full_name) {
      // eslint-disable-next-line no-console
      console.log('Column full_name already exists. No changes made.');
      process.exit(0);
    }

    // Common alternative column names that might already contain the full name
    const alt = cols.fullname ? 'fullname' : cols.fullName ? 'fullName' : null;

    // Add the column (nullable for safety)
    // Use raw query to ensure MySQL compatibility across versions
    // eslint-disable-next-line no-console
    console.log('Adding column full_name to users table...');
    await sequelize.query("ALTER TABLE users ADD COLUMN full_name VARCHAR(100) NULL AFTER id;");

    if (alt) {
      // Migrate data from existing column
      // eslint-disable-next-line no-console
      console.log(`Migrating data from existing column '${alt}' into 'full_name'`);
      await sequelize.query(`UPDATE users SET full_name = ${alt} WHERE full_name IS NULL;`);
    }

    // eslint-disable-next-line no-console
    console.log('Done. full_name column added (and data migrated if applicable).');
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error while adding full_name column:', err);
    process.exit(1);
  }
})();
