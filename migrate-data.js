const { Client } = require('pg');

async function migrateData() {
  const localUrl = "postgresql://postgres:ripamustopa99@localhost:5432/consultant";
  const neonUrl = "postgresql://neondb_owner:npg_QB6Fjb3YXyOc@ep-misty-pond-adk06xio-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

  const localClient = new Client({ connectionString: localUrl });
  const neonClient = new Client({ connectionString: neonUrl });

  try {
    await localClient.connect();
    console.log("Connected to local DB");
    await neonClient.connect();
    console.log("Connected to Neon DB");

    // Fetch users from local
    const usersRes = await localClient.query('SELECT * FROM users');
    const users = usersRes.rows;
    console.log(`Found ${users.length} users in local DB`);

    // Insert to Neon
    for (const user of users) {
      await neonClient.query(
        `INSERT INTO users (id, name, email, password, "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (email) DO NOTHING`,
        [user.id, user.name, user.email, user.password, user.createdAt, user.updatedAt]
      );
      console.log(`Migrated user: ${user.email}`);
    }

    console.log("Data migration completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await localClient.end();
    await neonClient.end();
  }
}

migrateData();
