-- Akon's GymHouse Database Schema
-- Run this in phpMyAdmin to create the database structure

-- Create database
CREATE DATABASE IF NOT EXISTS gymhouse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gymhouse;

-- Users table (admins, trainers, members)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('admin', 'trainer', 'member') DEFAULT 'member',
    specialty VARCHAR(100) DEFAULT NULL,
    plan VARCHAR(50) DEFAULT NULL,
    plan_expiry DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Membership plans table
CREATE TABLE plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    duration VARCHAR(50) DEFAULT 'weekly',
    description TEXT,
    features TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE classes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    trainer_id INT NOT NULL,
    days VARCHAR(100) NOT NULL,
    time VARCHAR(10) NOT NULL,
    duration INT DEFAULT 45,
    max_capacity INT DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    amount INT NOT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Check-ins table
CREATE TABLE checkins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_checkin (user_id, date)
);

-- Class bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    class_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    status ENUM('booked', 'attended', 'missed', 'cancelled') DEFAULT 'booked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Insert default plans
INSERT INTO plans (id, name, price, duration, description, features, featured) VALUES
('basic', 'Basic', 2500, 'weekly', 'Perfect for beginners who want to get started', 'Access to gym floor\nLocker room access\nBasic equipment\nShower facilities', FALSE),
('standard', 'Standard', 4000, 'weekly', 'Most popular choice for regular gym-goers', 'Everything in Basic\nAll group classes\nSauna access\nNutrition guide\nProgress tracking', TRUE),
('premium', 'Premium', 6500, 'weekly', 'For those who want the complete experience', 'Everything in Standard\n2 PT sessions/month\nPersonalized workout plan\nPriority class booking\nRecovery zone access', FALSE);

-- Insert default admin user (plain text password for school project)
INSERT INTO users (name, email, phone, password, role) VALUES
('Admin User', 'admin@akonsgym.com', '+254 712 345 678', 'admin123', 'admin');

-- Insert default trainer users
INSERT INTO users (name, email, phone, password, role, specialty) VALUES
('M. Akon', 'mike@akonsgym.com', '+254 712 345 679', 'trainer123', 'trainer', 'Yoga & Mobility'),
('J. Kip', 'john@akonsgym.com', '+254 712 345 680', 'trainer123', 'trainer', 'Strength & Conditioning'),
('L. Wanjiku', 'lisa@akonsgym.com', '+254 712 345 681', 'trainer123', 'trainer', 'HIIT & Core');

-- Insert default classes
INSERT INTO classes (id, name, trainer_id, days, time, duration, max_capacity) VALUES
('c1', 'Sunrise Yoga', 2, 'Mon,Wed,Fri', '06:00', 45, 15),
('c2', 'HIIT & Strength', 3, 'Tue,Thu,Sat', '07:30', 45, 20),
('c3', 'Lower Body Burn', 4, 'Mon,Thu', '09:00', 45, 18),
('c4', 'Upper Body Sculpt', 3, 'Mon,Wed,Fri', '17:30', 45, 20),
('c5', 'Mobility & Core', 2, 'Tue,Thu', '19:00', 45, 15),
('c6', 'Weekend Warrior', 4, 'Sat', '10:00', 60, 25);

-- Insert sample member
INSERT INTO users (name, email, phone, password, role, plan, plan_expiry) VALUES
('John Doe', 'john.doe@email.com', '+254 712 345 682', 'member123', 'member', 'standard', DATE_ADD(CURDATE(), INTERVAL 7 DAY));

-- Insert sample payment for the member
INSERT INTO payments (user_id, plan_id, amount, transaction_id, phone, status) VALUES
(5, 'standard', 4000, CONCAT('MP', UNIX_TIMESTAMP()), '+254 712 345 682', 'completed');
