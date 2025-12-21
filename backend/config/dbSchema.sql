-- Create database
CREATE DATABASE IF NOT EXISTS africa_db;
USE africa_db;

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: admin123 - change this!)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@africa.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- Note: The password hash above is a placeholder. 
-- The actual hash will be generated when you register the admin user through the API
-- Or you can use: bcrypt.hash('admin123', 10) to generate a proper hash

