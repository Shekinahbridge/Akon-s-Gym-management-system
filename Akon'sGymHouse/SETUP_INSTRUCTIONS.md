# Akon's GymHouse - MySQL Database Setup Instructions

## Overview
This guide will help you set up the MySQL database using phpMyAdmin for the Akon's GymHouse gym management system.

---

## Step 1: Install XAMPP (if not already installed)

1. Download XAMPP from: https://www.apachefriends.org/
2. Install XAMPP with **Apache** and **MySQL** selected
3. Start the XAMPP Control Panel
4. Click **Start** on Apache and MySQL modules

---

## Step 2: Access phpMyAdmin

1. Open your web browser
2. Go to: `http://localhost/phpmyadmin`
3. You should see the phpMyAdmin dashboard

---

## Step 3: Create the Database

### Option A: Using the SQL Import (Recommended)

1. In phpMyAdmin, click on the **"SQL"** tab at the top
2. Copy and paste the entire contents of `database.sql` file
3. Click **"Go"** to execute the SQL
4. The database `gymhouse` and all tables will be created automatically

### Option B: Manual Creation

1. Click **"New"** in the left sidebar
2. Enter database name: `gymhouse`
3. Click **"Create"**
4. Click on the `gymhouse` database
5. Go to **"Import"** tab
6. Click **"Choose File"** and select `database.sql`
7. Click **"Go"**

---

## Step 4: Verify Database Setup

After running the SQL, you should see these tables in your `gymhouse` database:
- `users` - Stores all users (admins, trainers, members)
- `plans` - Membership plans (Basic, Standard, Premium)
- `classes` - Gym classes
- `payments` - Payment records
- `checkins` - Member check-ins
- `bookings` - Class bookings

### Default Users Created:
| Email | Password | Role |
|-------|----------|------|
| admin@akonsgym.com | admin123 | Admin |
| mike@akonsgym.com | trainer123 | Trainer |
| john@akonsgym.com | trainer123 | Trainer |
| lisa@akonsgym.com | trainer123 | Trainer |
| john.doe@email.com | member123 | Member |

---

## Step 5: Configure Database Connection

1. Open the file: `api/db.php`
2. Update the database credentials if needed:

```php
$host = 'localhost';
$dbname = 'gymhouse';
$username = 'root';      // Change if your MySQL username is different
$password = '';          // Change if your MySQL password is set
```

**Note:** Default XAMPP MySQL has:
- Username: `root`
- Password: (empty - no password)

---

## Step 6: Deploy the Application

### Option A: Using XAMPP htdocs folder

1. Copy the entire `gymhouse` folder to:
   - **Windows:** `C:\xampp\htdocs\gymhouse`
   - **Mac:** `/Applications/XAMPP/htdocs/gymhouse`
   - **Linux:** `/opt/lampp/htdocs/gymhouse`

2. Access the application at: `http://localhost/gymhouse`

### Option B: Using a custom folder

1. Place the `gymhouse` folder anywhere on your computer
2. Configure Apache to point to that folder
3. Or use a local development server

---

## Step 7: Test the Application

1. Open your browser
2. Go to: `http://localhost/gymhouse`
3. Click **"Sign In"**
4. Use any of the default login credentials above
5. The system should work exactly like the original localStorage version!

---

## Troubleshooting

### Problem: "Database connection failed"
**Solution:** 
- Make sure MySQL is running in XAMPP
- Check your database credentials in `api/db.php`
- Verify the database `gymhouse` exists

### Problem: "Access denied for user"
**Solution:**
- Check if your MySQL username/password is correct
- Default XAMPP uses `root` with no password

### Problem: "Table doesn't exist"
**Solution:**
- Re-run the `database.sql` script in phpMyAdmin
- Make sure you're in the correct database

### Problem: "404 Not Found" when accessing API
**Solution:**
- Make sure the `api` folder is in the correct location
- Check that your web server supports PHP
- Verify the URL is correct

---

## For Your School Presentation

### Quick Login Options (Built-in!)

The login page has quick login buttons at the bottom:
- **Admin Login:** Click "Admin" button → auto-fills admin credentials
- **Trainer Login:** Click "Trainer" button → auto-fills trainer credentials  
- **Member Login:** Click "Member" button → auto-fills member credentials

### What to Show Your Teacher:

1. **Homepage** - Professional gym website design
2. **Login System** - Multiple user roles (Admin, Trainer, Member)
3. **Database Integration** - All data stored in MySQL
4. **Admin Dashboard** - Full gym management features
5. **Member Portal** - Check-ins, class bookings, payments
6. **Trainer Portal** - Class management, attendance tracking
7. **Reports** - Generate and export CSV reports

---

## File Structure

```
gymhouse/
├── index.html              # Homepage
├── database.sql            # Database schema
├── css/
│   └── styles.css          # All styles
├── js/
│   └── app.js              # Main JavaScript with API calls
├── api/
│   ├── db.php              # Database connection
│   └── api.php             # All API endpoints
└── pages/
    ├── login.html          # Login page
    ├── register.html       # Registration page
    ├── admin/              # Admin pages
    │   ├── dashboard.html
    │   ├── members.html
    │   ├── trainers.html
    │   ├── classes.html
    │   ├── payments.html
    │   ├── reports.html
    │   └── settings.html
    ├── member/             # Member pages
    │   ├── dashboard.html
    │   ├── checkin.html
    │   ├── classes.html
    │   ├── payments.html
    │   └── profile.html
    └── trainer/            # Trainer pages
        ├── dashboard.html
        ├── classes.html
        ├── attendance.html
        ├── schedule.html
        └── profile.html
```

---

## Key Features

✅ **No Password Hashing** - Simple plain text passwords for easy demo
✅ **MySQL Database** - All data persisted in database
✅ **Multiple User Roles** - Admin, Trainer, Member
✅ **Member Management** - Add, edit, delete members
✅ **Trainer Management** - Manage trainer profiles
✅ **Class Management** - Create and schedule classes
✅ **Payment Tracking** - Record and track all payments
✅ **Check-in System** - Track member attendance
✅ **Class Bookings** - Members can book classes
✅ **Reports** - Generate and export reports
✅ **M-Pesa Simulation** - Simulated payment processing

---

## Need Help?

If you encounter any issues:
1. Check that XAMPP Apache and MySQL are running
2. Verify the database was created correctly in phpMyAdmin
3. Check the `api/db.php` credentials match your setup
4. Make sure all files are in the correct location

Good luck with your presentation! 🎉
