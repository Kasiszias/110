<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Time Capsule Configuration
    |--------------------------------------------------------------------------
    */

    // Maximum number of artifacts allowed per capsule
    'max_artifacts' => env('CAPSULE_MAX_ARTIFACTS', 50),

    // Maximum file size in MB for artifact files
    'max_file_size_mb' => env('CAPSULE_MAX_FILE_SIZE_MB', 20),

    // Default timeout for capsule processing (in seconds)
    'processing_timeout' => env('CAPSULE_PROCESSING_TIMEOUT', 600),

    // Memory limit for capsule processing
    'memory_limit' => env('CAPSULE_MEMORY_LIMIT', '512M'),

    // Storage path for artifact files
    'storage_path' => env('CAPSULE_STORAGE_PATH', 'capsule_artifacts'),

    // Logging settings
    'logging' => [
        'enabled' => env('CAPSULE_LOGGING_ENABLED', true),
        'level' => env('CAPSULE_LOG_LEVEL', 'info'),
    ],

    // Rate limiting
    'rate_limit' => [
        'enabled' => env('CAPSULE_RATE_LIMIT_ENABLED', true),
        'max_requests' => env('CAPSULE_MAX_REQUESTS_PER_HOUR', 10),
    ],

    // Feature flags
    'features' => [
        'guest_capsules' => env('CAPSULE_GUEST_CAPSULES_ENABLED', true),
        'step_by_step_creation' => env('CAPSULE_STEP_BY_STEP_ENABLED', true),
        'bulk_upload' => env('CAPSULE_BULK_UPLOAD_ENABLED', true),
    ],
];