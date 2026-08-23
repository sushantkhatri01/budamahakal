const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load .env file explicitly
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: Check if variables are loaded
if (process.env.GMAIL_USER) {
    console.log('✅ Environment variables loaded from .env');
} else {
    console.log('⚠️ .env file found but variables not loaded. Content check:');
    const fs = require('fs');
    const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    if (envContent.includes('GMAIL_USER')) {
        console.log('✅ GMAIL_USER is in .env file');
    } else {
        console.log('❌ GMAIL_USER not found in .env file');
    }
}

const db = require('./src/database');
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const { initializeTransporter, sendBookingEmail, sendCustomerConfirmation } = require('./src/email');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize email service with credentials from .env
console.log('📧 Email Config:', {
    user: process.env.GMAIL_USER ? '✓ Set' : '✗ Missing',
    password: process.env.GMAIL_PASSWORD ? `✓ Set (${process.env.GMAIL_PASSWORD.length} chars)` : '✗ Missing'
});
initializeTransporter(process.env.GMAIL_USER, process.env.GMAIL_PASSWORD);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Database on startup
db.initializeDataFiles();

// Routes
app.get('/api/courses', (req, res) => {
  try {
    const courses = db.getAllCourses();
    res.json({ courses: courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/instructors', (req, res) => {
  try {
    const instructors = db.getAllInstructors();
    res.json({ instructors: instructors });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { name, email, phone, course, date } = req.body;
    const result = db.addBooking(name, email, phone, course, date);
    
    if (result.success) {
      // Get course details for email
      const courses = db.getAllCourses();
      const courseData = courses.find(c => c.id == course);
      const bookingData = { name, email, phone, course, date };
      
      // Send email notifications asynchronously (don't block response)
      Promise.all([
        sendBookingEmail(bookingData, courseData),
        sendCustomerConfirmation(bookingData, courseData)
      ]).catch(err => console.error('Email notification error:', err));
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error adding booking:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/courses', (req, res) => {
  try {
    const { name, description, duration, price, sessions } = req.body;
    const result = db.addCourse(name, description, duration, price, sessions);
    res.json(result);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/instructors', (req, res) => {
  try {
    const { name, specialization, experience, phone, email } = req.body;
    const result = db.addInstructor(name, specialization, experience, phone, email);
    res.json(result);
  } catch (error) {
    console.error('Error adding instructor:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookings', (req, res) => {
  try {
    const bookings = db.getAllBookings();
    res.json({ bookings: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/bookings/:id', (req, res) => {
  try {
    const result = db.updateBooking(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/bookings/:id', (req, res) => {
  try {
    const result = db.deleteBooking(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/courses/:id', (req, res) => {
  try {
    const result = db.updateCourse(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/courses/:id', (req, res) => {
  try {
    const result = db.deleteCourse(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/instructors/:id', (req, res) => {
  try {
    const result = db.updateInstructor(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/instructors/:id', (req, res) => {
  try {
    const result = db.deleteInstructor(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true, token: Buffer.from(`${username}:${password}`).toString('base64') });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/api/attendance', (req, res) => {
  try {
    const attendance = db.getAllAttendance();
    res.json({ attendance: attendance });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/attendance', (req, res) => {
  try {
    const { bookingId, studentName, courseName, date, status, instructor, notes } = req.body;
    const result = db.addAttendance(bookingId, studentName, courseName, date, status, instructor, notes);
    res.json(result);
  } catch (error) {
    console.error('Error adding attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/attendance/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = db.updateAttendance(id, updates);
    res.json(result);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/attendance/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.deleteAttendance(id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/attendance/date/:date', (req, res) => {
  try {
    const { date } = req.params;
    const attendance = db.getAttendanceByDate(date);
    res.json({ attendance: attendance });
  } catch (error) {
    console.error('Error fetching attendance by date:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/attendance/student/:name', (req, res) => {
  try {
    const { name } = req.params;
    const attendance = db.getAttendanceByStudent(name);
    res.json({ attendance: attendance });
  } catch (error) {
    console.error('Error fetching attendance by student:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin portal route
app.get(['/admin', '/admin/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`\n🚗 BudaMahakal Driving School Server`);
  console.log(`📍 Local:   http://localhost:${PORT}`);
  console.log(`🌐 Network: http://${localIP}:${PORT}`);
  console.log(`🔑 Admin:   http://localhost:${PORT}/admin.html`);
  console.log(`💾 Database: File-based (data/ folder)`);
  console.log(`✨ Ready to accept bookings!\n`);
});
