<?php
require_once 'db.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

switch ($action) {
    // ========== USERS ==========
    case 'login':
        if ($method !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
        $data = getJsonInput();
        $email = strtolower(trim($data['email'] ?? ''));
        $password = $data['password'] ?? '';
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND password = ?");
        $stmt->execute([$email, $password]);
        $user = $stmt->fetch();
        
        if ($user) {
            unset($user['password']);
            sendJson(['success' => true, 'user' => $user]);
        } else {
            sendJson(['success' => false, 'error' => 'Invalid email or password']);
        }
        break;
    
    case 'getUsers':
        $role = $_GET['role'] ?? '';
        if ($role) {
            $stmt = $pdo->prepare("SELECT id, name, email, phone, role, specialty, plan, plan_expiry, created_at FROM users WHERE role = ?");
            $stmt->execute([$role]);
        } else {
            $stmt = $pdo->query("SELECT id, name, email, phone, role, specialty, plan, plan_expiry, created_at FROM users");
        }
        sendJson(['success' => true, 'users' => $stmt->fetchAll()]);
        break;
    
    case 'getUser':
        $id = $_GET['id'] ?? 0;
        $stmt = $pdo->prepare("SELECT id, name, email, phone, role, specialty, plan, plan_expiry, created_at FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        if ($user) {
            sendJson(['success' => true, 'user' => $user]);
        } else {
            sendJson(['success' => false, 'error' => 'User not found']);
        }
        break;
    
    case 'getUserByEmail':
        $email = strtolower(trim($_GET['email'] ?? ''));
        $stmt = $pdo->prepare("SELECT id, name, email, phone, role, specialty, plan, plan_expiry, created_at FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        sendJson(['success' => true, 'user' => $user]);
        break;
    
    case 'addUser':
        if ($method !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
        $data = getJsonInput();
        
        $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, password, role, specialty, plan, plan_expiry) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        try {
            $stmt->execute([
                $data['name'],
                strtolower(trim($data['email'])),
                $data['phone'],
                $data['password'],
                $data['role'] ?? 'member',
                $data['specialty'] ?? null,
                $data['plan'] ?? null,
                $data['planExpiry'] ?? null
            ]);
            $id = $pdo->lastInsertId();
            sendJson(['success' => true, 'user' => ['id' => $id, ...$data]]);
        } catch (PDOException $e) {
            sendJson(['success' => false, 'error' => 'Email already exists']);
        }
        break;
    
    case 'updateUser':
        if ($method !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
        $data = getJsonInput();
        $id = $data['id'] ?? 0;
        
        $fields = [];
        $values = [];
        
        if (isset($data['name'])) { $fields[] = 'name = ?'; $values[] = $data['name']; }
        if (isset($data['email'])) { $fields[] = 'email = ?'; $values[] = strtolower(trim($data['email'])); }
        if (isset($data['phone'])) { $fields[] = 'phone = ?'; $values[] = $data['phone']; }
        if (isset($data['password'])) { $fields[] = 'password = ?'; $values[] = $data['password']; }
        if (isset($data['role'])) { $fields[] = 'role = ?'; $values[] = $data['role']; }
        if (isset($data['specialty'])) { $fields[] = 'specialty = ?'; $values[] = $data['specialty']; }
        if (isset($data['plan'])) { $fields[] = 'plan = ?'; $values[] = $data['plan']; }
        if (isset($data['planExpiry'])) { $fields[] = 'plan_expiry = ?'; $values[] = $data['planExpiry']; }
        
        if (empty($fields)) {
            sendJson(['success' => false, 'error' => 'No fields to update']);
        }
        
        $values[] = $id;
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);
        
        sendJson(['success' => true]);
        break;
    
    case 'deleteUser':
        if ($method !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
        $data = getJsonInput();
        $id = $data['id'] ?? 0;
        
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        
        sendJson(['success' => true]);
        break;
    
    // ========== PLANS ==========
    case 'getPlans':
        $stmt = $pdo->query("SELECT * FROM plans");
        $plans = $stmt->fetchAll();
        foreach ($plans as &$plan) {
            $plan['features'] = explode("\n", $plan['features']);
            $plan['price'] = (int)$plan['price'];
            $plan['featured'] = (bool)$plan['featured'];
        }
        sendJson(['success' => true, 'plans' => $plans]);
        break;
    
    case 'getPlan':
        $id = $_GET['id'] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM plans WHERE id = ?");
        $stmt->execute([$id]);
        $plan = $stmt->fetch();
        if ($plan) {
            $plan['features'] = explode("\n", $plan['features']);
            $plan['price'] = (int)$plan['price'];
            $plan['featured'] = (bool)$plan['featured'];
            sendJson(['success' => true, 'plan' => $plan]);
        } else {
            sendJson(['success' => false, 'error' => 'Plan not found']);
        }
        break;
    
    case 'savePlan':
        if ($method !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
        $data = getJsonInput();
        
        $features = is_array($data['features']) ? implode("\n", $data['features']) : $data['features'];
        
        if (isset($data['id']) && $data['id']) {
            // Update existing
            $stmt = $pdo->prepare("UPDATE plans SET name = ?, price = ?, description = ?, features = ?, featured = ? WHERE id = ?");
            $stmt->execute([$data['name'], $data['price'], $data['description'] ?? '', $features, $data['featured'] ? 1 : 0, $data['id']]);
        } else {
            // Insert new
            $id = $data['id'] ?? 'plan' . time();
            $stmt = $pdo->prepare("INSERT INTO plans (id, name, price, description, features, featured) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $data['name'], $data['price'], $data['description'] ?? '', $features, $data['featured'] ? 1 : 0]);
        }
        sendJson(['success' => true]);
        break;
    
    // ========== CLASSES ==========
    case 'getClasses':
        $stmt = $pdo->query("SELECT c.*, u.name as trainer_name FROM classes c JOIN users u ON c.trainer_id = u.id");
        $classes = $stmt->fetchAll();
        foreach ($classes as &$cls) {
            $cls['days'] = array_map('trim', explode(',', $cls['days']));
            $cls['duration'] = (int)$cls['duration'];
            $cls['maxCapacity'] = (int)$cls['max_capacity'];
            unset($cls['max_capacity']);
        }
        sendJson(['success' => true, 'classes' => $classes]);
        break;
    
    case 'getClass':
        $id = $_GET['id'] ?? '';
        $stmt = $pdo->prepare("SELECT c.*, u.name as trainer_name FROM classes c JOIN users u ON c.trainer_id = u.id WHERE c.id = ?");
        $stmt->execute([$id]);
        $cls = $stmt->fetch();
        if ($cls) {
            $cls['days'] = array_map('trim', explode(',', $cls['days']));
            $cls['duration'] = (int)$cls['duration'];
            $cls['maxCapacity'] = (int)$cls['max_capacity'];
            unset($cls['max_capacity']);
            sendJson(['success' => true, 'class' => $cls]);
        } else {
            sendJson(['success' => false, 'error' => 'Class not found']);
        }
        break;
    
    case 'getClassesByTrainer':
        $trainerId = $_GET['trainerId'] ?? 0;
        $stmt = $pdo->prepare("SELECT * FROM classes WHERE trainer_id = ?");
        $stmt->execute([$trainerId]);
        $classes = $stmt->fetchAll();
        foreach ($classes as &$cls) {
            $cls['days'] = array_map('trim', explode(',', $cls['days']));
            $cls['duration'] = (int)$cls['duration'];
            $cls['maxCapacity'] = (int)$cls['max_capacity'];
            unset($cls['max_capacity']);
        }
        sendJson(['success' => true, 'classes' => $classes]);
        break;
    
    case 'saveClass':
        if ($method !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
        $data = getJsonInput();
        
        $days = is_array($data['days']) ? implode(',', $data['days']) : $data['days'];
        $id = $data['id'] ?? 'c' . time();
        
        // Check if class exists
        $stmt = $pdo->prepare("SELECT id FROM classes WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->fetch()) {
            // Update
            $stmt = $pdo->prepare("UPDATE classes SET name = ?, trainer_id = ?, days = ?, time = ?, duration = ?, max_capacity = ? WHERE id = ?");
            $stmt->execute([$data['name'], $data['trainerId'], $days, $data['time'], $data['duration'], $data['maxCapacity'], $id]);
        } else {
            // Insert
            $stmt = $pdo->prepare("INSERT INTO classes (id, name, trainer_id, days, time, duration, max_capacity) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $data['name'], $data['trainerId'], $days, $data['time'], $data['duration'], $data['maxCapacity']]);
        }
        sendJson(['success' => true]);
        break;
    
    case 'deleteClass':
        if ($method !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
        $data = getJsonInput();
        $id = $data['id'] ?? '';
        
        $stmt = $pdo->prepare("DELETE FROM classes WHERE id = ?");
        $stmt->execute([$id]);
        
        sendJson(['success' => true]);
        break;
    
    // ========== PAYMENTS ==========
    case 'getPayments':
        $stmt = $pdo->query("SELECT p.*, u.name as user_name, pl.name as plan_name FROM payments p JOIN users u ON p.user_id = u.id JOIN plans pl ON p.plan_id = pl.id ORDER BY p.created_at DESC");
        $payments = $stmt->fetchAll();
        foreach ($payments as &$p) {
            $p['amount'] = (int)$p['amount'];
        }
        sendJson(['success' => true, 'payments' => $payments]);
        break;
    
    case 'getPaymentsByUser':
        $userId = $_GET['userId'] ?? 0;
        $stmt = $pdo->prepare("SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        $payments = $stmt->fetchAll();
        foreach ($payments as &$p) {
            $p['amount'] = (int)$p['amount'];
        }
        sendJson(['success' => true, 'payments' => $payments]);
        break;
    
    case 'addPayment':
        if ($method !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
        $data = getJsonInput();
        
        $stmt = $pdo->prepare("INSERT INTO payments (user_id, plan_id, amount, transaction_id, phone, status) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['userId'],
            $data['planId'],
            $data['amount'],
            $data['transactionId'],
            $data['phone'] ?? '',
            $data['status'] ?? 'completed'
        ]);
        
        sendJson(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;
    
    // ========== CHECKINS ==========
    case 'getCheckins':
        $stmt = $pdo->query("SELECT c.*, u.name as user_name FROM checkins c JOIN users u ON c.user_id = u.id ORDER BY c.date DESC, c.time DESC");
        sendJson(['success' => true, 'checkins' => $stmt->fetchAll()]);
        break;
    
    case 'getCheckinsByUser':
        $userId = $_GET['userId'] ?? 0;
        $stmt = $pdo->prepare("SELECT * FROM checkins WHERE user_id = ? ORDER BY date DESC, time DESC");
        $stmt->execute([$userId]);
        sendJson(['success' => true, 'checkins' => $stmt->fetchAll()]);
        break;
    
    case 'getTodayCheckin':
        $userId = $_GET['userId'] ?? 0;
        $today = date('Y-m-d');
        $stmt = $pdo->prepare("SELECT * FROM checkins WHERE user_id = ? AND date = ?");
        $stmt->execute([$userId, $today]);
        $checkin = $stmt->fetch();
        sendJson(['success' => true, 'checkin' => $checkin]);
        break;
    
    case 'addCheckin':
        if ($method !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
        $data = getJsonInput();
        
        $today = date('Y-m-d');
        $time = date('H:i');
        
        try {
            $stmt = $pdo->prepare("INSERT INTO checkins (user_id, date, time) VALUES (?, ?, ?)");
            $stmt->execute([$data['userId'], $today, $time]);
            sendJson(['success' => true, 'checkin' => ['id' => $pdo->lastInsertId(), 'user_id' => $data['userId'], 'date' => $today, 'time' => $time]]);
        } catch (PDOException $e) {
            sendJson(['success' => false, 'error' => 'Already checked in today']);
        }
        break;
    
    // ========== BOOKINGS ==========
    case 'getBookings':
        $stmt = $pdo->query("SELECT b.*, u.name as user_name, c.name as class_name FROM bookings b JOIN users u ON b.user_id = u.id JOIN classes c ON b.class_id = c.id ORDER BY b.date DESC");
        sendJson(['success' => true, 'bookings' => $stmt->fetchAll()]);
        break;
    
    case 'getBookingsByUser':
        $userId = $_GET['userId'] ?? 0;
        $stmt = $pdo->prepare("SELECT b.*, c.name as class_name FROM bookings b JOIN classes c ON b.class_id = c.id WHERE b.user_id = ? ORDER BY b.date DESC");
        $stmt->execute([$userId]);
        sendJson(['success' => true, 'bookings' => $stmt->fetchAll()]);
        break;
    
    case 'getBookingsByClass':
        $classId = $_GET['classId'] ?? '';
        $stmt = $pdo->prepare("SELECT b.*, u.name as user_name FROM bookings b JOIN users u ON b.user_id = u.id WHERE b.class_id = ? ORDER BY b.date DESC");
        $stmt->execute([$classId]);
        sendJson(['success' => true, 'bookings' => $stmt->fetchAll()]);
        break;
    
    case 'addBooking':
        if ($method !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
        $data = getJsonInput();
        
        $stmt = $pdo->prepare("INSERT INTO bookings (user_id, class_id, date, status) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['userId'], $data['classId'], $data['date'], $data['status'] ?? 'booked']);
        
        sendJson(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;
    
    case 'updateBooking':
        if ($method !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
        $data = getJsonInput();
        
        $stmt = $pdo->prepare("UPDATE bookings SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $data['id']]);
        
        sendJson(['success' => true]);
        break;
    
    case 'markAttendance':
        if ($method !== 'POST') sendJson(['error' => 'Method not allowed'], 405);
        $data = getJsonInput();
        
        $status = $data['attended'] ? 'attended' : 'missed';
        $stmt = $pdo->prepare("UPDATE bookings SET status = ? WHERE id = ?");
        $stmt->execute([$status, $data['id']]);
        
        sendJson(['success' => true]);
        break;
    
    // ========== STATS ==========
    case 'getStats':
        $stats = [];
        
        // Total members
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM users WHERE role = 'member'");
        $stats['totalMembers'] = (int)$stmt->fetch()['count'];
        
        // Today's checkins
        $today = date('Y-m-d');
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM checkins WHERE date = ?");
        $stmt->execute([$today]);
        $stats['todayCheckins'] = (int)$stmt->fetch()['count'];
        
        // Weekly revenue
        $weekAgo = date('Y-m-d', strtotime('-7 days'));
        $stmt = $pdo->prepare("SELECT SUM(amount) as total FROM payments WHERE created_at >= ?");
        $stmt->execute([$weekAgo]);
        $stats['weeklyRevenue'] = (int)($stmt->fetch()['total'] ?? 0);
        
        // Total revenue
        $stmt = $pdo->query("SELECT SUM(amount) as total FROM payments");
        $stats['totalRevenue'] = (int)($stmt->fetch()['total'] ?? 0);
        
        // Active classes
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM classes");
        $stats['activeClasses'] = (int)$stmt->fetch()['count'];
        
        sendJson(['success' => true, 'stats' => $stats]);
        break;
    
    default:
        sendJson(['error' => 'Unknown action'], 400);
}
