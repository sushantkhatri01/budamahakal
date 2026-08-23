# BudaMahakal Driving School - Interactive Website

A professional interactive website for BudaMahakal Driving School built with Node.js/Express and vanilla HTML/CSS/JavaScript.

## Features

- **Navigation Menu**: Easy access to different sections
- **Hero Section**: Eye-catching landing area
- **Course Listing**: Display available driving courses
- **Instructor Profiles**: Browse certified instructors
- **Online Booking**: Interactive booking form
- **Contact Information**: Easy contact details
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
website/
├── public/              # Frontend files
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styling
│   └── app.js          # Frontend JavaScript
├── src/                # Backend source (for future database connections)
├── server.js           # Express server
├── package.json        # Node dependencies
├── .env                # Environment variables
└── README.md          # This file
```

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/courses` - Get all courses
- `GET /api/instructors` - Get all instructors
- `POST /api/bookings` - Submit a new booking

## Next Steps

1. **Connect to Database**: Update `server.js` to connect to `Database5.accdb`
2. **Add Database Tables**: Ensure database has tables for:
   - Courses
   - Instructors
   - Bookings
   - Students/Clients
3. **Implement API Routes**: Replace placeholder endpoints with real database queries
4. **Add Authentication**: Implement login/registration if needed
5. **Deploy**: Host on a web server or cloud platform

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: Microsoft Access (Database5.accdb)

## License

All rights reserved © 2026 BudaMahakal Driving School
