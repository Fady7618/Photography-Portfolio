const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:7kT9G9HPLcBeEjXl@db.fomlqnnpghjfdvasbbsv.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Database connection successful!');
    const res = await client.query('SELECT version()');
    console.log('Database version:', res.rows[0]);
    await client.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error code:', error.code);
  }
}

testConnection();