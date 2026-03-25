const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDatabase() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USERNAME || 'film_user',
    password: process.env.DATABASE_PASSWORD || 'film_password',
    database: process.env.DATABASE_NAME || 'film_db',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Читаем SQL файлы
    const initSql = fs.readFileSync(path.join(__dirname, '../sql/init.sql'), 'utf8');
    const dataSql = fs.readFileSync(path.join(__dirname, '../sql/data.sql'), 'utf8');

    // Выполняем создание таблиц
    console.log('📀 Creating tables...');
    await client.query(initSql);
    console.log('✅ Tables created successfully');

    // Заполняем данными
    console.log('📝 Inserting data...');
    await client.query(dataSql);
    console.log('✅ Data inserted successfully');

    console.log('🎉 Database initialization completed!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

initDatabase();