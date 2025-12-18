VAULT - TIME CAPSULE APPLICATION
===============================

OVERVIEW
--------
Vault is a comprehensive time capsule application built with Laravel 11, Inertia.js, and React. It allows users to create digital time capsules containing memories, historical data, and artifacts that can be sealed and opened at future dates.

FEATURES
--------
✓ User Authentication & Registration
✓ Time Capsule Creation & Management
✓ Artifact Collection (Personal Memories, Photos, Videos, Documents)
✓ Historical Data Integration (Wikipedia Events, News Headlines, Weather, Economic Data)
✓ 3D Spline Background Animations
✓ Responsive Design with Mobile Support
✓ Advanced UI with Tailwind CSS, Aceternity UI, and Framer Motion
✓ Real-time Data from External APIs
✓ Email Notifications for Capsule Recipients
✓ Secure File Upload with Validation

TECHNICAL STACK
---------------
Backend:
- Laravel 11 (PHP Framework)
- MySQL Database
- Sanctum Authentication
- File Storage System

Frontend:
- React 18 with Inertia.js
- Tailwind CSS for Styling
- Framer Motion for Animations
- Aceternity UI Components
- Spline 3D Graphics
- Lucide React Icons

External APIs:
- Wikipedia API (Historical Events)
- NewsAPI (Current Headlines)
- OpenWeatherMap API (Weather Data)
- Financial Modeling Prep API (Economic Data)

INSTALLATION & SETUP
--------------------

1. Prerequisites:
   - PHP 8.2+
   - Composer
   - Node.js 18+
   - MySQL 8.0+
   - Git

2. Clone Repository:
   git clone <repository-url>
   cd vault-time-capsule

3. Install PHP Dependencies:
   composer install

4. Install Node Dependencies:
   npm install

5. Environment Setup:
   cp .env.example .env
   # Configure database credentials in .env

6. Generate Application Key:
   php artisan key:generate

7. Run Database Migrations:
   php artisan migrate

8. Build Assets:
   npm run build
   # or for development:
   npm run dev

9. Start Application:
   php artisan serve

USAGE GUIDE
-----------

Creating an Account:
1. Visit the application homepage
2. Click "Create Your First Capsule"
3. Fill in registration details
4. Verify your email if required

Creating a Time Capsule:
1. Log in to your account
2. Select a time period from the left panel
3. Add artifacts from the center panel:
   - Personal memories and notes
   - Historical events from Wikipedia
   - Current news headlines
   - Weather data
   - Economic indicators
4. Configure capsule settings:
   - Capsule name and description
   - Reveal date (must be in future)
   - Personal message
   - Email recipients (optional)
5. Click "Seal Capsule" to create

Managing Capsules:
- View all capsules in the Vault section
- Capsules show creation date and reveal date
- Locked capsules cannot be opened until reveal date
- Delete capsules if needed

API INTEGRATIONS
----------------
The application integrates with multiple external APIs:

Wikipedia API:
- Fetches historical events for selected years
- Provides context for time capsule creation

NewsAPI:
- Retrieves current news headlines
- Allows users to include contemporary events

OpenWeatherMap:
- Historical weather data
- Weather summaries for different years

Financial Modeling Prep:
- Economic indicators and data
- Stock market information

FILE STRUCTURE
--------------
app/                    # Laravel Application Code
├── Console/           # Artisan Commands
├── Http/Controllers/  # HTTP Controllers
├── Models/           # Eloquent Models
├── Providers/        # Service Providers

database/              # Database Files
├── migrations/       # Database Migrations
├── seeders/          # Database Seeders

resources/             # Frontend Resources
├── css/             # Stylesheets
├── js/              # React Components
│   ├── Components/  # Reusable Components
│   ├── Hooks/       # Custom React Hooks
│   ├── Layouts/     # Page Layouts
│   └── Pages/       # Inertia Pages
└── views/           # Blade Templates

routes/               # Route Definitions
├── api.php          # API Routes
├── web.php          # Web Routes
└── auth.php         # Authentication Routes

SECURITY FEATURES
-----------------
- CSRF Protection on all forms
- Sanctum API Authentication
- File upload validation and size limits
- Input sanitization and validation
- Secure password hashing
- Session management

PERFORMANCE OPTIMIZATIONS
-------------------------
- Lazy loading of components
- Optimized API calls with caching
- Efficient database queries
- Compressed assets
- Progressive loading of 3D elements

MOBILE RESPONSIVENESS
---------------------
- Fully responsive design
- Touch-friendly interface
- Optimized layouts for mobile devices
- Mobile-specific CSS adjustments

TROUBLESHOOTING
----------------

Common Issues:

1. Capsule Sealing Timeout:
   - Check internet connection
   - Ensure file sizes are under 10MB
   - Verify all required fields are filled

2. API Data Not Loading:
   - Check API keys in .env file
   - Verify external API services are available
   - Check browser console for errors

3. File Upload Issues:
   - Ensure files are valid types (JPEG, PNG, GIF, MP4, PDF, TXT)
   - Check file size limits
   - Verify storage permissions

4. Authentication Problems:
   - Clear browser cache and cookies
   - Check CSRF token validity
   - Verify database connection

DEVELOPMENT NOTES
-----------------
- Uses Vite for asset compilation
- Hot module replacement in development
- ESLint and Prettier for code quality
- PHPUnit for backend testing
- Comprehensive error handling and logging

CONTRIBUTING
------------
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

LICENSE
-------
This project is licensed under the MIT License.

SUPPORT
-------
For support or questions, please create an issue in the repository or contact the development team.

VERSION
-------
Current Version: 1.0.0
Last Updated: December 2024
