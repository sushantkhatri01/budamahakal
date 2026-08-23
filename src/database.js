const fs = require('fs');
const path = require('path');

// Data storage paths
const dataDir = path.join(__dirname, '..', 'data');
const coursesFile = path.join(dataDir, 'courses.json');
const instructorsFile = path.join(dataDir, 'instructors.json');
const bookingsFile = path.join(dataDir, 'bookings.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data files
function initializeDataFiles() {
  try {
    // Initialize courses
    if (!fs.existsSync(coursesFile)) {
      const defaultCourses = [
        {
          id: 1,
          name: 'Car Driving - 7 Days (Beginner)',
          description: 'Basic driving skills and safety for car beginners.',
          duration: 7,
          price: 300,
          sessions: 7,
          vehicleType: 'Car',
          createdDate: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Car Driving - 15 Days (Intermediate)',
          description: 'Advanced car driving techniques and road confidence.',
          duration: 15,
          price: 600,
          sessions: 15,
          vehicleType: 'Car',
          createdDate: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Bike Driving - 7 Days (Beginner)',
          description: 'Fundamental motorcycle riding and safety training.',
          duration: 7,
          price: 250,
          sessions: 7,
          vehicleType: 'Bike',
          createdDate: new Date().toISOString()
        },
        {
          id: 4,
          name: 'Bike Driving - 15 Days (Intermediate)',
          description: 'Advanced motorcycle skills and highway riding.',
          duration: 15,
          price: 550,
          sessions: 15,
          vehicleType: 'Bike',
          createdDate: new Date().toISOString()
        },
        {
          id: 5,
          name: 'Scooter Riding - 7 Days (Beginner)',
          description: 'Easy scooter basics for new riders.',
          duration: 7,
          price: 200,
          sessions: 7,
          vehicleType: 'Scooter',
          createdDate: new Date().toISOString()
        },
        {
          id: 6,
          name: 'Scooter Riding - 15 Days (Intermediate)',
          description: 'Build confidence and advanced scooter techniques.',
          duration: 15,
          price: 450,
          sessions: 15,
          vehicleType: 'Scooter',
          createdDate: new Date().toISOString()
        },
        {
          id: 7,
          name: 'Scooter Riding - 25 Days (Professional)',
          description: 'Comprehensive professional scooter riding certification.',
          duration: 25,
          price: 800,
          sessions: 25,
          vehicleType: 'Scooter',
          createdDate: new Date().toISOString()
        }
      ];
      fs.writeFileSync(coursesFile, JSON.stringify(defaultCourses, null, 2));
      console.log('✅ Courses data initialized');
    }

    // Initialize instructors
    if (!fs.existsSync(instructorsFile)) {
      const defaultInstructors = [
        {
          id: 1,
          name: 'John Smith',
          specialization: 'Basic & Advanced Driving',
          experience: 12,
          phone: '+1-800-123-4567',
          email: 'john@budamahakal.com',
          createdDate: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          specialization: 'Highway & Long Distance',
          experience: 8,
          phone: '+1-800-234-5678',
          email: 'sarah@budamahakal.com',
          createdDate: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Mike Williams',
          specialization: 'Defensive Driving',
          experience: 15,
          phone: '+1-800-345-6789',
          email: 'mike@budamahakal.com',
          createdDate: new Date().toISOString()
        },
        {
          id: 4,
          name: 'Emma Davis',
          specialization: 'Parking & City Driving',
          experience: 10,
          phone: '+1-800-456-7890',
          email: 'emma@budamahakal.com',
          createdDate: new Date().toISOString()
        }
      ];
      fs.writeFileSync(instructorsFile, JSON.stringify(defaultInstructors, null, 2));
      console.log('✅ Instructors data initialized');
    }

    // Initialize bookings
    if (!fs.existsSync(bookingsFile)) {
      fs.writeFileSync(bookingsFile, JSON.stringify([], null, 2));
      console.log('✅ Bookings data initialized');
    }

    console.log('✅ Database ready');
    return true;
  } catch (error) {
    console.error('Error initializing data files:', error.message);
    return false;
  }
}

// Read courses from file
function getAllCourses() {
  try {
    if (fs.existsSync(coursesFile)) {
      const data = fs.readFileSync(coursesFile, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading courses:', error.message);
    return [];
  }
}

// Read instructors from file
function getAllInstructors() {
  try {
    if (fs.existsSync(instructorsFile)) {
      const data = fs.readFileSync(instructorsFile, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading instructors:', error.message);
    return [];
  }
}

// Read all bookings
function getAllBookings() {
  try {
    if (fs.existsSync(bookingsFile)) {
      const data = fs.readFileSync(bookingsFile, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading bookings:', error.message);
    return [];
  }
}

// Add a new course
function addCourse(courseName, description, duration, price, sessions) {
  try {
    const courses = getAllCourses();
    const newCourse = {
      id: Math.max(...courses.map(c => c.id), 0) + 1,
      name: courseName,
      description: description,
      duration: duration,
      price: price,
      sessions: sessions,
      createdDate: new Date().toISOString()
    };
    courses.push(newCourse);
    fs.writeFileSync(coursesFile, JSON.stringify(courses, null, 2));
    console.log('✅ Course added:', courseName);
    return { success: true, message: 'Course added successfully', course: newCourse };
  } catch (error) {
    console.error('Error adding course:', error.message);
    return { success: false, message: error.message };
  }
}

// Add a new instructor
function addInstructor(name, specialization, experience, phone, email) {
  try {
    const instructors = getAllInstructors();
    const newInstructor = {
      id: Math.max(...instructors.map(i => i.id), 0) + 1,
      name: name,
      specialization: specialization,
      experience: experience,
      phone: phone,
      email: email,
      createdDate: new Date().toISOString()
    };
    instructors.push(newInstructor);
    fs.writeFileSync(instructorsFile, JSON.stringify(instructors, null, 2));
    console.log('✅ Instructor added:', name);
    return { success: true, message: 'Instructor added successfully', instructor: newInstructor };
  } catch (error) {
    console.error('Error adding instructor:', error.message);
    return { success: false, message: error.message };
  }
}

// Add a new booking
function addBooking(studentName, email, phone, courseID, preferredDate) {
  try {
    const bookings = getAllBookings();
    const newBooking = {
      id: bookings.length + 1,
      studentName: studentName,
      email: email,
      phone: phone,
      courseID: courseID,
      preferredDate: preferredDate,
      status: 'Pending',
      createdDate: new Date().toISOString()
    };
    bookings.push(newBooking);
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
    console.log('✅ Booking added:', studentName);
    return { success: true, message: 'Booking submitted successfully', booking: newBooking };
  } catch (error) {
    console.error('Error adding booking:', error.message);
    return { success: false, message: error.message };
  }
}

// Attendance Management
function getAllAttendance() {
  try {
    const attendanceFile = path.join(__dirname, '..', 'data', 'attendance.json');
    if (!fs.existsSync(attendanceFile)) {
      return [];
    }
    const data = fs.readFileSync(attendanceFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading attendance:', error);
    return [];
  }
}

function addAttendance(bookingId, studentName, courseName, date, status, instructor, notes = '') {
  try {
    const attendanceFile = path.join(__dirname, '..', 'data', 'attendance.json');
    const attendance = getAllAttendance();
    
    const newAttendance = {
      id: attendance.length > 0 ? Math.max(...attendance.map(a => a.id)) + 1 : 1,
      bookingId: parseInt(bookingId),
      studentName,
      courseName,
      date,
      status, // 'Present', 'Absent', 'Late', 'Cancelled'
      instructor,
      notes,
      createdDate: new Date().toISOString()
    };
    
    attendance.push(newAttendance);
    fs.writeFileSync(attendanceFile, JSON.stringify(attendance, null, 2));
    console.log('✅ Attendance record added:', studentName, date, status);
    return { success: true, attendance: newAttendance };
  } catch (error) {
    console.error('Error adding attendance:', error);
    return { success: false, message: error.message };
  }
}

function updateAttendance(id, updates) {
  try {
    const attendanceFile = path.join(__dirname, '..', 'data', 'attendance.json');
    const attendance = getAllAttendance();
    
    const index = attendance.findIndex(a => a.id === parseInt(id));
    if (index === -1) {
      return { success: false, message: 'Attendance record not found' };
    }
    
    attendance[index] = { ...attendance[index], ...updates };
    fs.writeFileSync(attendanceFile, JSON.stringify(attendance, null, 2));
    console.log('✅ Attendance record updated:', id);
    return { success: true, attendance: attendance[index] };
  } catch (error) {
    console.error('Error updating attendance:', error);
    return { success: false, message: error.message };
  }
}

function getAttendanceByDate(date) {
  try {
    const attendance = getAllAttendance();
    return attendance.filter(a => a.date === date);
  } catch (error) {
    console.error('Error filtering attendance by date:', error);
    return [];
  }
}

function getAttendanceByStudent(studentName) {
  try {
    const attendance = getAllAttendance();
    return attendance.filter(a => a.studentName.toLowerCase().includes(studentName.toLowerCase()));
  } catch (error) {
    console.error('Error filtering attendance by student:', error);
    return [];
  }
}

function deleteAttendance(id) {
  try {
    const attendanceFile = path.join(__dirname, '..', 'data', 'attendance.json');
    const attendance = getAllAttendance();
    const index = attendance.findIndex(a => a.id == id);
    
    if (index === -1) {
      return { success: false, message: 'Attendance record not found' };
    }
    
    attendance.splice(index, 1);
    
    // Save updated attendance data
    fs.writeFileSync(attendanceFile, JSON.stringify(attendance, null, 2));
    
    return { success: true, message: 'Attendance record deleted successfully' };
  } catch (error) {
    console.error('Error deleting attendance:', error);
    return { success: false, message: error.message };
  }
}

// Update a booking
function updateBooking(id, updates) {
  try {
    const bookings = getAllBookings();
    const index = bookings.findIndex(b => b.id == id);
    if (index === -1) return { success: false, message: 'Booking not found' };
    bookings[index] = { ...bookings[index], ...updates };
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
    return { success: true, booking: bookings[index] };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Delete a booking
function deleteBooking(id) {
  try {
    const bookings = getAllBookings();
    const index = bookings.findIndex(b => b.id == id);
    if (index === -1) return { success: false, message: 'Booking not found' };
    bookings.splice(index, 1);
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
    return { success: true, message: 'Booking deleted successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Update a course
function updateCourse(id, updates) {
  try {
    const courses = getAllCourses();
    const index = courses.findIndex(c => c.id == id);
    if (index === -1) return { success: false, message: 'Course not found' };
    courses[index] = { ...courses[index], ...updates };
    fs.writeFileSync(coursesFile, JSON.stringify(courses, null, 2));
    return { success: true, course: courses[index] };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Delete a course
function deleteCourse(id) {
  try {
    const courses = getAllCourses();
    const index = courses.findIndex(c => c.id == id);
    if (index === -1) return { success: false, message: 'Course not found' };
    courses.splice(index, 1);
    fs.writeFileSync(coursesFile, JSON.stringify(courses, null, 2));
    return { success: true, message: 'Course deleted successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Update an instructor
function updateInstructor(id, updates) {
  try {
    const instructors = getAllInstructors();
    const index = instructors.findIndex(i => i.id == id);
    if (index === -1) return { success: false, message: 'Instructor not found' };
    instructors[index] = { ...instructors[index], ...updates };
    fs.writeFileSync(instructorsFile, JSON.stringify(instructors, null, 2));
    return { success: true, instructor: instructors[index] };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Delete an instructor
function deleteInstructor(id) {
  try {
    const instructors = getAllInstructors();
    const index = instructors.findIndex(i => i.id == id);
    if (index === -1) return { success: false, message: 'Instructor not found' };
    instructors.splice(index, 1);
    fs.writeFileSync(instructorsFile, JSON.stringify(instructors, null, 2));
    return { success: true, message: 'Instructor deleted successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = {
  initializeDataFiles,
  getAllCourses,
  getAllInstructors,
  addCourse,
  addInstructor,
  updateCourse,
  deleteCourse,
  updateInstructor,
  deleteInstructor,
  addBooking,
  updateBooking,
  deleteBooking,
  getAllBookings,
  getAllAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceByDate,
  getAttendanceByStudent
};

