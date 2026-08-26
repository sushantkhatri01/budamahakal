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
                    // Strips away text indicators like " days" or " Days" to extract the pure math digits
                    const rawDuration = String(course.duration).replace(/[^0-9]/g, '');
                    const numericDuration = parseInt(rawDuration, 10) || 1; 
                    const perDayPrice = Math.round(course.price / numericDuration);
                    
                    return `
                        <div class="course-card">
                            <span class="category-badge">${course.vehicleType || 'Scooter'}</span>
                            <h3>${course.name}</h3>
                            <p>${course.description}</p>
                            
                            <div style="margin-bottom: 15px; width: 100%;">
                                <span class="meta-label">Duration:</span>
                                <span class="meta-value" style="float: right;">${course.duration} days</span>
                            </div>
                            <div style="margin-bottom: 20px; width: 100%;">
                                <span class="meta-label">Sessions:</span>
                                <span class="meta-value" style="float: right;">${course.sessions}</span>
                            </div>
                            
                            <!-- Attractive Theme Price Container Block Box -->
                            <div class="price-box" style="width: 100%; box-sizing: border-box;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                    <span>Total Price:</span>
                                    <span class="total-price-value">₹${course.price}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; opacity: 0.9;">
                                    <span>Per Day:</span>
                                    <span class="per-day-value">₹${perDayPrice}</span>
                                </div>
                            </div>

                            <button class="course-btn" style="margin-top: 20px; width: 100%;" onclick="selectAndScrollToBooking('${course.id}')">
                                Book This Course
                            </button>
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

// Interactive helper bridge to select dropdown item and snap to view element
window.selectAndScrollToBooking = function(courseId) {
    const dropdown = document.getElementById('course');
    const bookingSection = document.getElementById('booking');
    
    if (dropdown) {
        dropdown.value = courseId;
    }
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
};

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
