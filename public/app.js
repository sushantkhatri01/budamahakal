coursesList.innerHTML = allCourses.map(course => {
    // Strips away text indicators to extract pure mathematical digits
    const rawDuration = String(course.duration).replace(/[^0-9]/g, '');
    const numericDuration = parseInt(rawDuration, 10) || 1; 
    const perDayPrice = Math.round(course.price / numericDuration);
    
    // Formats any incoming price cleanly into Nepalese Rupees text structure
    const formatCurrency = (amount) => `Rs. ${Number(amount).toLocaleString('en-NP')}`;

    return `
        <div class="course-card">
            <span class="category-badge">${course.vehicleType || 'Scooter'}</span>
            <h3>${course.name}</h3>
            <p>${course.description}</p>
            
            <!-- Removed aggressive red text colors and replaced with elegant slate colors -->
            <div style="margin-bottom: 15px; width: 100%;">
                <span class="meta-label">Duration:</span>
                <span class="meta-value" style="float: right; color: #333333; font-weight: 600;">${course.duration} days</span>
            </div>
            <div style="margin-bottom: 20px; width: 100%;">
                <span class="meta-label">Sessions:</span>
                <span class="meta-value" style="float: right; color: #333333; font-weight: 600;">${course.sessions}</span>
            </div>
            
            <!-- Beautiful Theme Price Container Block Box with Rs. Currency -->
            <div class="price-box" style="width: 100%; box-sizing: border-box;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span>Total Price:</span>
                    <span class="total-price-value">${formatCurrency(course.price)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; opacity: 0.9;">
                    <span>Per Day:</span>
                    <span class="per-day-value">${formatCurrency(perDayPrice)}</span>
                </div>
            </div>

            <button class="course-btn" style="margin-top: 20px; width: 100%;" onclick="selectAndScrollToBooking('${course.id}')">
                Book This Course
            </button>
        </div>
    `;
}).join('');
