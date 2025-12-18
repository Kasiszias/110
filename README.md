# 🕰️ VAULT - Time Capsule Application

[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=flat&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.0-4E56A6?style=flat)](https://inertiajs.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat&logo=php)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-00758F?style=flat&logo=mysql)](https://mysql.com)

**Vault** is a comprehensive digital time capsule application that allows users to preserve memories, artifacts, and historical data for future discovery. Built with Laravel 11, Inertia.js, and React, it combines modern web technologies with the nostalgic concept of time capsules.

## Features

### Core Functionality

-   **User Authentication & Registration** - Secure user management with Laravel Sanctum
-   **Time Capsule Creation & Management** - Full CRUD operations for digital time capsules
-   **Artifact Collection** - Support for photos, videos, documents, and personal memories
-   **Scheduled Revealing** - Capsules can be sealed and opened at future dates
-   **Guest Capsule Creation** - Allow anonymous users to create capsules

### Historical Data Integration

-   **Wikipedia Events** - Historical events from any year
-   **News Headlines** - Current and historical news data
-   **Weather Data** - Historical weather information via OpenWeatherMap
-   **Economic Indicators** - Stock market and economic data

### Advanced Features

-   **3D Spline Background Animations** - Immersive user experience
-   **Responsive Design** - Mobile-first approach with Tailwind CSS
-   **Real-time Data** - Live API integrations
-   **Email Notifications** - Notify recipients when capsules are revealed
-   **Secure File Upload** - Validated file handling with storage optimization
-   **Multiple UI Libraries** - Aceternity UI, Framer Motion, and custom components

## Technical Stack

### Backend Architecture

```
Laravel 11 (PHP Framework)
├── Authentication: Laravel Sanctum
├── Database: MySQL 8.0+ with Eloquent ORM
├── File Storage: Laravel Filesystem (Public/Local)
├── Queue System: Laravel Queue for async processing
└── API Rate Limiting & Security
```

### Frontend Architecture

```
React 18 + Inertia.js
├── UI Framework: Tailwind CSS
├── Animations: Framer Motion
├── 3D Graphics: Spline
├── Icons: Lucide React
└── State Management: React Hooks + Inertia
```

### External API Integrations

-   **Wikipedia API** - Historical events and information
-   **NewsAPI** - Current news headlines and articles
-   **OpenWeatherMap** - Historical weather data
-   **Financial Modeling Prep** - Economic indicators and stock data

### Development Tools

-   **Build System**: Vite for fast development and optimized builds
-   **Testing**: PHPUnit for backend testing
-   **Code Quality**: Laravel Pint for code formatting
-   **Development**: Laravel Sail for containerized development

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed on your system:

-   **PHP 8.2+** with required extensions:

    ```bash
    php -v
    # Required extensions: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML
    ```

-   **Composer 2.5+** for PHP dependency management:

    ```bash
    composer --version
    ```

-   **Node.js 18+** and **npm/yarn** for frontend dependencies:

    ```bash
    node --version
    npm --version
    ```

-   **MySQL 8.0+** or **MariaDB 10.6+**:

    ```bash
    mysql --version
    ```

-   **Git** for version control:
    ```bash
    git --version
    ```

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd vault-time-capsule
```

#### 2. Install PHP Dependencies

```bash
composer install
```

#### 3. Install Node Dependencies

```bash
npm install
# or if you prefer yarn:
yarn install
```

#### 4. Environment Configuration

```bash
# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### 5. Configure Environment Variables

Edit your `.env` file with the following configurations:

```env
# Application
APP_NAME="Vault Time Capsule"
APP_ENV=local
APP_KEY=base64:your-generated-key
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vault_time_capsule
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Session & Cache
SESSION_DRIVER=database
CACHE_DRIVER=file

# File Storage
FILESYSTEM_DISK=public

# Queue Configuration (for background processing)
QUEUE_CONNECTION=database

# External API Keys (Required for full functionality)
WIKIPEDIA_API_KEY=your_wikipedia_key  # Optional - works without key
NEWS_API_KEY=your_newsapi_key
OPENWEATHER_API_KEY=your_openweather_key
ECONOMIC_DATA_API_KEY=your_economic_data_key

# Mail Configuration (for notifications)
MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourapp.com"
MAIL_FROM_NAME="${APP_NAME}"

# Time Capsule Specific Settings
CAPSULE_MAX_FILE_SIZE_MB=20
CAPSULE_MAX_ARTIFACTS=50
CAPSULE_STORAGE_PATH=capsule_artifacts
```

#### 6. Create Database

```bash
# Create database in MySQL
mysql -u root -p
CREATE DATABASE vault_time_capsule;
exit
```

#### 7. Run Database Migrations

```bash
php artisan migrate
```

#### 8. Link Storage Directory

```bash
php artisan storage:link
```

#### 9. Seed Database (Optional)

```bash
php artisan db:seed
```

#### 10. Build Assets

```bash
# For production
npm run build

# For development with hot reload
npm run dev
```

#### 11. Start the Application

```bash
# Using Laravel's built-in server
php artisan serve

# Or using the development script (includes queue worker and logs)
composer run dev
```

The application will be available at `http://localhost:8000`

## 🏗️ Development Setup

### Using Laravel Sail (Recommended for Docker)

```bash
# Install Laravel Sail
composer require laravel/sail --dev
php artisan sail:install

# Start all services
./vendor/bin/sail up -d

# Install dependencies
./vendor/bin/sail composer install
./vendor/bin/sail npm install

# Run migrations
./vendor/bin/sail artisan migrate

# Start development
./vendor/bin/sail npm run dev
```

### Development Commands

```bash
# Start queue worker for background jobs
php artisan queue:work

# Watch for file changes during development
php artisan config:cache
php artisan route:cache

# Run tests
php artisan test

# Code formatting
./vendor/bin/pint

# Clear various caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

## Technical Implementation

### Architecture Overview

The application follows a layered architecture pattern:

```
┌─────────────────────────────────────┐
│           Frontend (React)           │
│  ┌─────────────┐ ┌─────────────────┐ │
│  │  Inertia.js │ │   React Components│ │
│  │             │ │   Tailwind CSS   │ │
│  └─────────────┘ └─────────────────┘ │
└─────────────────────────────────────┘
                  ↕ HTTP/Zip
┌─────────────────────────────────────┐
│         Backend (Laravel)            │
│  ┌─────────────┐ ┌─────────────────┐ │
│  │ Controllers │ │    Services      │ │
│  │   (MVC)     │ │   (Business)     │ │
│  └─────────────┘ └─────────────────┘ │
│  ┌─────────────┐ ┌─────────────────┐ │
│  │   Models    │ │   Repositories   │ │
│  │  (Eloquent) │ │     (Data)       │ │
│  └─────────────┘ └─────────────────┘ │
└─────────────────────────────────────┘
                  ↕ SQL
┌─────────────────────────────────────┐
│           Database (MySQL)           │
│     TimeCapsules & Artifacts        │
└─────────────────────────────────────┘
```

### Core Components

#### 1. Time Capsule Service Layer (`app/Services/TimeCapsuleService.php`)

The service layer encapsulates all business logic for time capsule operations:

**Key Features:**

-   **Transaction Management**: Ensures data consistency during capsule creation
-   **File Processing**: Handles multiple file uploads with validation
-   **Artifact Management**: Processes different types of artifacts (text, files, API data)
-   **Error Handling**: Comprehensive error handling with detailed logging
-   **Guest Support**: Allows anonymous capsule creation

**Implementation Highlights:**

```php
public function createTimeCapsule(array $validatedData): array
{
    $requestId = Str::uuid()->toString();

    try {
        DB::beginTransaction();

        // Create capsule with user or guest support
        $capsule = $this->createCapsule($validatedData);

        // Process artifacts with file handling
        $artifactsResult = $this->processArtifacts(
            $capsule,
            $validatedData['artifacts'] ?? [],
            $requestId
        );

        DB::commit();

        return [
            'success' => true,
            'capsule' => $capsule->load('artifacts'),
            'stats' => $artifactsResult
        ];

    } catch (\Exception $e) {
        DB::rollBack();
        // Comprehensive error handling
    }
}
```

#### 2. Request Validation (`app/Http/Requests/StoreTimeCapsuleRequest.php`)

Dedicated form request classes ensure robust validation:

**Validation Rules:**

-   **Capsule Data**: Title, description, reveal date, email recipients
-   **File Uploads**: Type validation, size limits, security checks
-   **Guest Support**: Optional user authentication
-   **Content Limits**: Prevent abuse with reasonable limits

#### 3. Frontend Components (`resources/js/`)

**Component Architecture:**

-   **Layouts**: `AuthenticatedLayout.jsx`, `GuestLayout.jsx`
-   **Pages**: Time capsule creation, management, viewing
-   **UI Components**: Reusable components with Tailwind CSS
-   **3D Elements**: Spline background animations for immersive experience

### Database Schema Evolution

The application underwent significant schema evolution (24+ migration files), addressing:

#### Key Migration Milestones:

1. **Initial Schema** (`2025_12_07_063119`): Basic time_capsules and capsule_artifacts tables
2. **Public Capsules** (`2025_12_17_095755`): Added is_public field for sharing
3. **Artifact Titles** (`2025_12_17_195020`): Enhanced artifact management
4. **Email Notifications** (`2025_12_18_100000`): Added recipient notification system
5. **Schema Refinement** (`2025_12_26_000000`): Final schema optimization

#### Final Schema Structure:

```sql
-- Time Capsules Table
CREATE TABLE time_capsules (
    id BIGINT UNSIGNED PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL, -- NULL for guest capsules
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reveal_date DATETIME NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    email_recipients JSON NULL,
    message TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Capsule Artifacts Table
CREATE TABLE capsule_artifacts (
    id BIGINT UNSIGNED PRIMARY KEY,
    capsule_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    content JSON NOT NULL, -- Flexible content storage
    artifact_type VARCHAR(100) NOT NULL,
    year YEAR NOT NULL,
    media_path VARCHAR(255) NULL, -- File storage path
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```
