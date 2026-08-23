// Global variables
let allCourses = [];

// Load courses from backend
function loadCourses() {
    fetch('/api/courses')
        .then(response => response.json())
        .then(data => {
            allCourses = data.courses || [];
            console.log('✅ Loaded', allCourses.length, 'courses');
            
            // Display courses
            const coursesList = document.getElementById('courses-list');
            if (allCourses.length > 0) {
                coursesList.innerHTML = allCourses.map(course => {
                    const perDayPrice = Math.round(course.price / course.duration);
                    return `
                        <div class="course-card">
                            <div class="vehicle-badge">${course.vehicleType}</div>
                            <h3>${course.name}</h3>
                            <p>${course.description}</p>
                            <div class="course-details">
                                <span><strong>Duration:</strong> ${course.duration} days</span>
                                <span><strong>Sessions:</strong> ${course.sessions}</span>
                                <div class="price-breakdown">
                                    <div class="total-price"><strong>Total Price:</strong> <span class="amount">₹${course.price}</span></div>
                                    <div class="per-day-price"><strong>Per Day:</strong> <span class="amount">₹${perDayPrice}</span></div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                coursesList.innerHTML = '<p>No courses available at the moment.</p>';
            }
            
            // Populate dropdown
            populateCourseDropdown();
        })
        .catch(error => {
            console.error('Error loading courses:', error);
            document.getElementById('courses-list').innerHTML = '<p>Error loading courses.</p>';
        });
}

// Populate course dropdown
function populateCourseDropdown() {
    const courseSelect = document.getElementById('course');
    
    if (!courseSelect) {
        console.error('Course select element not found');
        return;
    }
    
    if (!allCourses || allCourses.length === 0) {
        console.error('No courses available');
        courseSelect.innerHTML = '<option value="">No courses available</option>';
        return;
    }
    
    // Build dropdown options
    let optionsHTML = '<option value="">-- Select a course --</option>\n';
    
    allCourses.forEach(course => {
        optionsHTML += `<option value="${course.id}">${course.name} - ₹${course.price}</option>\n`;
    });
    
    courseSelect.innerHTML = optionsHTML;
    console.log('✅ Course dropdown populated with', allCourses.length, 'options');
}

// Load instructors from backend
function loadInstructors() {
    fetch('/api/instructors')
        .then(response => response.json())
        .then(data => {
            const instructorsList = document.getElementById('instructors-list');
            if (data.instructors && data.instructors.length > 0) {
                instructorsList.innerHTML = data.instructors.map(instructor => `
                    <div class="instructor-card">
                        <h3>${instructor.name}</h3>
                        <p>${instructor.specialization}</p>
                        <p><strong>Experience:</strong> ${instructor.experience} years</p>
                    </div>
                `).join('');
            } else {
                instructorsList.innerHTML = '<p>No instructors available at the moment.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading instructors:', error);
            document.getElementById('instructors-list').innerHTML = '<p>Error loading instructors.</p>';
        });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded - initializing page');
    
    // Load courses and instructors
    loadCourses();
    loadInstructors();
    
    // Handle booking form submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        console.log('✅ Booking form found, attaching event listener');
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const courseValue = document.getElementById('course').value;
            console.log('📋 Form submitted, course selected:', courseValue);
            
            if (!courseValue) {
                alert('Please select a course');
                return;
            }
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                course: courseValue,
                date: document.getElementById('date').value
            };

            console.log('📤 Sending booking request:', formData);
            
            fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('📥 Booking response:', data);
                if (data.success) {
                    alert('✅ Booking submitted successfully! We will contact you soon.');
                    document.getElementById('booking-form').reset();
                    // Repopulate dropdown after reset
                    populateCourseDropdown();
                } else {
                    alert('❌ Error submitting booking. Please try again.');
                }
            })
            .catch(error => {
                console.error('❌ Error submitting booking:', error);
                alert('Error submitting booking. Please try again.');
            });
        });
    } else {
        console.error('❌ Booking form element not found');
    }
});
