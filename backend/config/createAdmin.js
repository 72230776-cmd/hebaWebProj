/**
 * Script to create an admin user
 * Run: node config/createAdmin.js
 */

require('dotenv').config();
const User = require('../models/User');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdmin() {
  try {
    console.log('=== Create Admin User ===\n');
    
    rl.question('Username: ', async (username) => {
      rl.question('Email: ', async (email) => {
        rl.question('Password: ', async (password) => {
          try {
            // Check if user exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
              console.log('\n❌ User with this email already exists!');
              rl.close();
              process.exit(1);
            }

            // Create admin user
            const admin = await User.create({
              username,
              email,
              password,
              role: 'admin'
            });

            console.log('\n✅ Admin user created successfully!');
            console.log('User ID:', admin.id);
            console.log('Username:', admin.username);
            console.log('Email:', admin.email);
            console.log('Role:', admin.role);
            
            rl.close();
            process.exit(0);
          } catch (error) {
            console.error('\n❌ Error creating admin:', error.message);
            rl.close();
            process.exit(1);
          }
        });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    rl.close();
    process.exit(1);
  }
}

createAdmin();

