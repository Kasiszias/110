<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Time Capsule Creator - Digital Archaeology</title>
    <style>

        .auth-navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.95);
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10000;
            border-bottom: 2px solid rgba(102,126,234,0.3);
        }
        .navbar-brand {
            font-size: 1.5em;
            font-weight: 700;
            color: #FFD700;
            text-decoration: none;
        }
        .navbar-user {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #E6D5B8;
        }
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.2em;
        }
        .logout-btn {
            background: rgba(255,71,87,0.3);
            border: 1px solid #ff4757;
            padding: 8px 20px;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.95em;
        }
        .logout-btn:hover {
            background: rgba(255,71,87,0.5);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            /* Loading overlay */
.loading-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    z-index: 9999;
    align-items: center;
    justify-content: center;
}

.loading-overlay.active {
    display: flex;
}

.spinner-large {
    border: 5px solid rgba(255,255,255,0.1);
    border-top: 5px solid #667eea;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Toast notification */
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.5);
    z-index: 10000;
    display: none;
    animation: slideIn 0.3s ease;
}

.toast.success {
    background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

.toast.error {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.toast.active {
    display: block;
}

@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow-x: hidden;
            background: #000;
            color: #fff;
        }

        /* Section 1: The Dig Site Hero */
        .hero-section {
            height: 100vh;
            background: linear-gradient(to bottom, 
                #87CEEB 0%,
                #E6D5B8 30%,
                #8B4513 60%,
                #654321 100%
            );
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }

        .dig-site {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .artifact-peek {
            position: absolute;
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            animation: float 3s ease-in-out infinite;
        }

        .artifact-peek:nth-child(1) { top: 40%; left: 20%; animation-delay: 0s; }
        .artifact-peek:nth-child(2) { top: 60%; left: 70%; animation-delay: 1s; }
        .artifact-peek:nth-child(3) { top: 50%; left: 50%; animation-delay: 2s; }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .hero-title {
            font-size: 4em;
            font-weight: 900;
            text-align: center;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.5);
            margin-bottom: 20px;
            z-index: 10;
        }

        .hero-subtitle {
            font-size: 1.8em;
            text-align: center;
            opacity: 0.9;
            z-index: 10;
        }

        .scroll-indicator {
            position: absolute;
            bottom: 40px;
            font-size: 1.2em;
            animation: bounce 2s infinite;
            cursor: pointer;
            z-index: 10;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
        }

        /* Section 2: Timeline Interface */
        .timeline-section {
            min-height: 100vh;
            background: linear-gradient(to bottom,
                #8B4513 0%,
                #654321 25%,
                #4A3520 50%,
                #2C1810 75%,
                #1A0F0A 100%
            );
            display: flex;
            padding: 40px 20px;
        }

        .timeline-container {
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
            display: grid;
            grid-template-columns: 200px 1fr 350px;
            gap: 30px;
        }

        /* Vertical Timeline Slider */
        .timeline-slider {
            background: rgba(255,255,255,0.05);
            border-radius: 15px;
            padding: 30px 20px;
            backdrop-filter: blur(10px);
            position: sticky;
            top: 20px;
            height: fit-content;
        }

        .timeline-slider h3 {
            color: #E6D5B8;
            margin-bottom: 20px;
            text-align: center;
        }

        .year-selector {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin: 20px 0;
        }

        .year-option {
            background: rgba(255,255,255,0.1);
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
            border: 2px solid transparent;
        }

        .year-option:hover {
            background: rgba(255,255,255,0.2);
            transform: translateX(5px);
        }

        .year-option.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: #fff;
        }

        .year-input-group {
            margin-top: 20px;
        }

        .year-input {
            width: 100%;
            padding: 10px;
            background: rgba(255,255,255,0.1);
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            color: white;
            text-align: center;
            font-size: 1em;
        }

        /* Artifact Canvas */
        .artifact-canvas {
            background: rgba(0,0,0,0.3);
            border-radius: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255,255,255,0.1);
        }

        .canvas-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .canvas-header h2 {
            color: #E6D5B8;
            font-size: 2em;
        }

        .current-year-display {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 1.2em;
            font-weight: 700;
        }

        .layer-stack {
            position: relative;
            min-height: 400px;
            background: rgba(255,255,255,0.05);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
        }

        .artifact-layer {
            background: rgba(255,255,255,0.1);
            border: 2px dashed rgba(255,255,255,0.3);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 15px;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
        }

        .artifact-layer:hover {
            background: rgba(255,255,255,0.2);
            border-style: solid;
            transform: scale(1.02);
        }

        .artifact-layer.sepia {
            filter: sepia(0.6) contrast(0.9);
        }

        .layer-content {
            display: flex;
            justify-content: space-between;
            align-items: start;
            gap: 20px;
        }

        .layer-info {
            flex: 1;
        }

        .layer-title {
            font-size: 1.3em;
            font-weight: 700;
            color: #FFD700;
            margin-bottom: 8px;
        }

        .layer-meta {
            font-size: 0.9em;
            color: #ccc;
            margin-bottom: 10px;
        }

        .layer-description {
            color: #e0e0e0;
            line-height: 1.6;
        }

        .layer-actions {
            display: flex;
            gap: 10px;
        }

        .layer-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
        }

        .layer-btn:hover {
            background: rgba(255,255,255,0.3);
        }

        .add-layer-btn {
            width: 100%;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 1.1em;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
        }

        .add-layer-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        /* Historical Library Panel */
        .historical-library {
            background: rgba(255,255,255,0.05);
            border-radius: 15px;
            padding: 25px;
            backdrop-filter: blur(10px);
            position: sticky;
            top: 20px;
            height: fit-content;
            max-height: 80vh;
            overflow-y: auto;
        }

        .historical-library h3 {
            color: #E6D5B8;
            margin-bottom: 20px;
        }

        .api-section {
            margin-bottom: 25px;
        }

        .api-title {
            color: #FFD700;
            font-size: 1.1em;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .api-content {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .api-content:hover {
            background: rgba(255,255,255,0.2);
            transform: translateX(5px);
        }

        .api-item {
            font-size: 0.9em;
            color: #e0e0e0;
            line-height: 1.6;
            margin-bottom: 8px;
        }

        .load-btn {
            width: 100%;
            padding: 10px;
            background: rgba(102, 126, 234, 0.3);
            border: 1px solid rgba(102, 126, 234, 0.6);
            border-radius: 6px;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
        }

        .load-btn:hover {
            background: rgba(102, 126, 234, 0.5);
        }

        /* Section 3: Capsule Assembly */
        .assembly-section {
            min-height: 100vh;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            padding: 60px 20px;
        }

        .assembly-container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .assembly-header {
            text-align: center;
            margin-bottom: 50px;
        }

        .assembly-header h2 {
            font-size: 3em;
            color: #E6D5B8;
            margin-bottom: 15px;
        }

        .assembly-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }

        .capsule-preview {
            background: rgba(255,255,255,0.05);
            border-radius: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255,255,255,0.1);
        }

        .capsule-3d {
            width: 100%;
            height: 400px;
            background: radial-gradient(circle at center, rgba(102, 126, 234, 0.2), transparent);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }

        .capsule-model {
            width: 200px;
            height: 300px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 100px;
            position: relative;
            animation: rotate3d 20s linear infinite;
            box-shadow: 0 20px 60px rgba(102, 126, 234, 0.6);
        }

        @keyframes rotate3d {
            0% { transform: rotateY(0deg) rotateX(10deg); }
            100% { transform: rotateY(360deg) rotateX(10deg); }
        }

        .capsule-contents {
            margin-top: 30px;
        }

        .contents-list {
            max-height: 300px;
            overflow-y: auto;
        }

        .content-chip {
            background: rgba(102, 126, 234, 0.2);
            padding: 10px 15px;
            border-radius: 20px;
            margin: 8px;
            display: inline-block;
            font-size: 0.9em;
            border: 1px solid rgba(102, 126, 234, 0.4);
        }

        .capsule-settings {
            background: rgba(255,255,255,0.05);
            border-radius: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255,255,255,0.1);
        }

        .setting-group {
            margin-bottom: 25px;
        }

        .setting-label {
            color: #E6D5B8;
            font-size: 1.1em;
            margin-bottom: 10px;
            display: block;
        }

        .setting-input {
            width: 100%;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 10px;
            color: white;
            font-size: 1em;
            font-family: inherit;
        }

        .setting-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        textarea.setting-input {
            min-height: 120px;
            resize: vertical;
        }

        .bury-button {
            width: 100%;
            padding: 25px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border: none;
            border-radius: 15px;
            color: white;
            font-size: 1.5em;
            font-weight: 900;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 30px;
            box-shadow: 0 10px 40px rgba(245, 87, 108, 0.4);
        }

        .bury-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 50px rgba(245, 87, 108, 0.6);
        }

        .bury-button:active {
            transform: translateY(0);
        }

        /* Buried Capsules Archive */
        .archive-section {
            background: rgba(255,255,255,0.05);
            border-radius: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255,255,255,0.1);
            margin-top: 40px;
        }

        .archive-header {
            color: #E6D5B8;
            font-size: 2em;
            margin-bottom: 30px;
            text-align: center;
        }

        .capsules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 25px;
        }

        .capsule-card {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            border-radius: 15px;
            padding: 25px;
            border: 2px solid rgba(255,255,255,0.1);
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }

        .capsule-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .capsule-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
            border-color: #667eea;
        }

        .capsule-card.locked::before {
            background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .capsule-card.unlocked::before {
            background: linear-gradient(90deg, #2ecc71, #27ae60);
        }

        .capsule-name {
            font-size: 1.5em;
            font-weight: 700;
            color: #FFD700;
            margin-bottom: 12px;
        }

        .capsule-info {
            font-size: 0.95em;
            color: #ccc;
            margin-bottom: 15px;
            line-height: 1.6;
        }

        .status-indicator {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 700;
            margin-bottom: 15px;
        }

        .status-indicator.locked {
            background: rgba(102, 126, 234, 0.3);
            color: #667eea;
            border: 1px solid #667eea;
        }

        .status-indicator.unlocked {
            background: rgba(46, 204, 113, 0.3);
            color: #2ecc71;
            border: 1px solid #2ecc71;
        }

        .countdown-display {
            font-size: 1.1em;
            color: #f093fb;
            font-weight: 700;
            margin: 12px 0;
        }

        .capsule-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        .action-btn {
            flex: 1;
            padding: 12px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.95em;
        }

        .action-btn:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
        }

        .action-btn.primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
        }

        .action-btn.danger {
            background: rgba(255, 71, 87, 0.3);
            border-color: #ff4757;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-y: auto;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 25px;
            padding: 50px;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            border: 2px solid rgba(255,255,255,0.2);
            animation: modalSlideIn 0.4s ease;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-100px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .close-modal {
            position: absolute;
            top: 20px;
            right: 30px;
            background: rgba(255,255,255,0.1);
            border: none;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            font-size: 1.8em;
            cursor: pointer;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .close-modal:hover {
            background: rgba(255,255,255,0.2);
            transform: rotate(90deg);
        }

        .modal-header {
            margin-bottom: 30px;
        }

        .modal-title {
            font-size: 2.5em;
            color: #FFD700;
            margin-bottom: 15px;
        }

        .artifact-showcase {
            background: rgba(255,255,255,0.05);
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 20px;
            border-left: 5px solid #667eea;
        }

        .artifact-showcase h4 {
            color: #E6D5B8;
            font-size: 1.4em;
            margin-bottom: 15px;
        }

        .artifact-type-badge {
            display: inline-block;
            background: rgba(102, 126, 234, 0.3);
            padding: 6px 14px;
            border-radius: 15px;
            font-size: 0.85em;
            color: #667eea;
            margin-left: 10px;
            border: 1px solid #667eea;
        }

        .artifact-text {
            color: #e0e0e0;
            line-height: 1.8;
            margin-top: 15px;
            font-size: 1.05em;
        }

        .personal-message {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
            padding: 30px;
            border-radius: 15px;
            border: 2px solid rgba(102, 126, 234, 0.4);
            margin-bottom: 30px;
        }

        .personal-message h3 {
            color: #FFD700;
            margin-bottom: 15px;
            font-size: 1.6em;
        }

        .personal-message p {
            color: #fff;
            line-height: 1.8;
            font-size: 1.1em;
        }

        .locked-message {
            text-align: center;
            padding: 60px 20px;
        }

        .lock-icon {
            font-size: 5em;
            margin-bottom: 20px;
            opacity: 0.7;
        }

        .locked-message h3 {
            color: #667eea;
            font-size: 2em;
            margin-bottom: 15px;
        }

        .locked-info {
            color: #ccc;
            font-size: 1.2em;
            line-height: 1.6;
        }

        .empty-state {
            text-align: center;
            padding: 80px 20px;
            color: #999;
        }

        .empty-icon {
            font-size: 5em;
            opacity: 0.3;
            margin-bottom: 20px;
        }

        /* Form Modal */
        .form-group {
            margin-bottom: 25px;
        }

        .form-label {
            color: #E6D5B8;
            font-size: 1.1em;
            margin-bottom: 10px;
            display: block;
            font-weight: 600;
        }

        .form-input {
            width: 100%;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 10px;
            color: white;
            font-size: 1em;
            font-family: inherit;
        }

        .form-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        textarea.form-input {
            min-height: 120px;
            resize: vertical;
        }

        select.form-input {
            cursor: pointer;
        }

        .submit-btn {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 1.2em;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 20px;
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);
        }

        /* Loading state */
        .loading {
            text-align: center;
            padding: 20px;
            color: #ccc;
        }

        .spinner {
            border: 3px solid rgba(255,255,255,0.1);
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
            .timeline-container {
                grid-template-columns: 180px 1fr 300px;
            }
        }

        @media (max-width: 992px) {
            .timeline-container {
                grid-template-columns: 1fr;
            }

            .timeline-slider,
            .historical-library {
                position: relative;
            }

            .assembly-grid {
                grid-template-columns: 1fr;
            }

            .hero-title {
                font-size: 2.5em;
            }

            .capsules-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .hero-title {
                font-size: 2em;
            }

            .hero-subtitle {
                font-size: 1.2em;
            }

            .modal-content {
                padding: 30px 20px;
            }

            .modal-title {
                font-size: 1.8em;
            }
        }
    </style>
</head>
<body>

          <nav class="auth-navbar">
        <a href="/" class="navbar-brand">⏳ Time Capsule Creator</a>
        <div class="navbar-user">
            @auth
                <div class="user-info">
                    <div class="user-avatar">{{ strtoupper(substr(auth()->user()->name, 0, 1)) }}</div>
                    <span>{{ auth()->user()->name }}</span>
                </div>
                <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                    @csrf
                    <button type="submit" class="logout-btn">Logout</button>
                </form>
            @endauth
        </div>
    </nav>

    <!-- Section 1: Hero Dig Site -->
    <section class="hero-section">
        <div class="dig-site">
            <div class="artifact-peek"></div>
            <div class="artifact-peek"></div>
            <div class="artifact-peek"></div>
            <h1 class="hero-title">⏳ TIME CAPSULE CREATOR</h1>
            <p class="hero-subtitle">Unearth the Past • Create the Future</p>
        </div>
        <div class="scroll-indicator" onclick="scrollToTimeline()">
            ↓ Scroll to begin excavation ↓
        </div>
    </section>

    <!-- Section 2: Timeline Interface -->
    <section class="timeline-section" id="timeline-section">
        <div class="timeline-container">
            <!-- Vertical Timeline Slider -->
            <div class="timeline-slider">
                <h3>🕰️ Time Period</h3>
                <div class="year-selector">
                    <div class="year-option" onclick="selectYear(2024)">2024 - Present</div>
                    <div class="year-option" onclick="selectYear(2000)">2000s - Digital Age</div>
                    <div class="year-option" onclick="selectYear(1990)">1990s</div>
                    <div class="year-option" onclick="selectYear(1969)">1969 - Moon Landing</div>
                    <div class="year-option" onclick="selectYear(1945)">1945 - WWII End</div>
                    <div class="year-option" onclick="selectYear(1900)">1900s - Turn of Century</div>
                </div>
                <div class="year-input-group">
                    <input type="number" class="year-input" id="customYear" placeholder="Custom Year (1800-2024)" min="1800" max="2024">
                    <button class="load-btn" onclick="loadCustomYear()" style="margin-top: 10px;">Load Year</button>
                </div>
            </div>

            <!-- Artifact Canvas -->
            <div class="artifact-canvas">
                <div class="canvas-header">
                    <h2>📦 Your Artifact Layers</h2>
                    <div class="current-year-display" id="currentYearDisplay">2024</div>
                </div>

                <div class="layer-stack" id="layerStack">
                    <div class="empty-state">
                        <div class="empty-icon">🏺</div>
                        <p>No artifacts yet.<br>Add historical events or personal memories!</p>
                    </div>
                </div>

                <button class="add-layer-btn" onclick="openAddLayerModal()">
                    ➕ Add New Artifact Layer
                </button>
            </div>

            <!-- Historical API Library -->
            <div class="historical-library">
                <h3>🏛️ Historical Library</h3>
                
                <div class="api-section">
                    <div class="api-title">📰 Wikipedia Events</div>
                    <div id="wikipediaEvents" class="loading">
                        <div class="spinner"></div>
                        <p>Loading events...</p>
                    </div>
                </div>

                <div class="api-section">
                    <div class="api-title">🌤️ Historical Weather</div>
                    <div id="weatherData" class="loading">
                        <div class="spinner"></div>
                        <p>Loading weather data...</p>
                    </div>
                </div>

                <div class="api-section">
                    <div class="api-title">💰 Economic Data</div>
                    <div id="economicData" class="api-content">
                        <div class="api-item">Historical stock prices and economic indicators for the selected year</div>
                        <button class="load-btn" onclick="loadEconomicData()">Load Data</button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 3: Capsule Assembly -->
    <section class="assembly-section">
        <div class="assembly-container">
            <div class="assembly-header">
                <h2>🧳 Assemble Your Time Capsule</h2>
                <p style="color: #ccc; font-size: 1.2em;">Gather your artifacts and set a reveal date</p>
            </div>

            <div class="assembly-grid">
                <!-- Capsule 3D Preview -->
                <div class="capsule-preview">
                    <h3 style="color: #E6D5B8; margin-bottom: 20px;">Capsule Preview</h3>
                    <div class="capsule-3d">
                        <div class="capsule-model"></div>
                    </div>
                    <div class="capsule-contents">
                        <h4 style="color: #FFD700; margin-bottom: 15px;">Contents:</h4>
                        <div class="contents-list" id="contentsList">
                            <p style="color: #999; text-align: center; padding: 20px;">No artifacts added yet</p>
                        </div>
                    </div>
                </div>

                <!-- Capsule Settings -->
                <div class="capsule-settings">
                    <h3 style="color: #E6D5B8; margin-bottom: 25px;">Capsule Configuration</h3>
                    
                    <div class="setting-group">
                        <label class="setting-label">Capsule Name</label>
                        <input type="text" class="setting-input" id="capsuleName" placeholder="My 2024 Memories">
                    </div>

                    <div class="setting-group">
                        <label class="setting-label">Reveal Date ⏰</label>
                        <input type="date" class="setting-input" id="revealDate">
                    </div>

                    <div class="setting-group">
                        <label class="setting-label">Personal Message 💌</label>
                        <textarea class="setting-input" id="personalMessage" placeholder="Write a message to your future self or recipients..."></textarea>
                    </div>

                    <div class="setting-group">
                        <label class="setting-label">Recipients (comma-separated emails)</label>
                        <input type="text" class="setting-input" id="recipients" placeholder="email1@example.com, email2@example.com">
                    </div>

                    <div class="setting-group">
                        <label class="setting-label">
                            <input type="checkbox" id="publicCapsule" style="margin-right: 10px;">
                            Make this capsule public
                        </label>
                    </div>

                    <button class="bury-button" onclick="buryCapsule()">
                        🔒 BURY TIME CAPSULE
                    </button>
                </div>
            </div>

            <!-- Buried Capsules Archive -->
            <div class="archive-section">
                <h2 class="archive-header">📚 Your Buried Capsules</h2>
                <div class="capsules-grid" id="capsulesArchive">
                    <div class="empty-state">
                        <div class="empty-icon">⏳</div>
                        <p>No buried capsules yet.<br>Create your first time capsule!</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Add Layer Modal -->
    <div class="modal" id="addLayerModal">
        <div class="modal-content">
            <button class="close-modal" onclick="closeAddLayerModal()">×</button>
            <div class="modal-header">
                <h2 class="modal-title">Add New Artifact Layer</h2>
            </div>

            <div class="form-group">
                <label class="form-label">Artifact Type</label>
                <select class="form-input" id="artifactType">
                    <option value="personal">Personal Memory</option>
                    <option value="photo">Photo Description</option>
                    <option value="historical">Historical Event</option>
                    <option value="letter">Letter</option>
                    <option value="quote">Quote</option>
                    <option value="prediction">Future Prediction</option>
                    <option value="document">Document</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" class="form-input" id="artifactTitle" placeholder="Give your artifact a title">
            </div>

            <div class="form-group">
                <label class="form-label">Year/Date</label>
                <input type="number" class="form-input" id="artifactYear" placeholder="e.g., 1969" min="1800" max="2100">
            </div>

            <div class="form-group">
                <label class="form-label">Content</label>
                <textarea class="form-input" id="artifactContent" placeholder="Describe your artifact in detail..."></textarea>
            </div>

            <button class="submit-btn" onclick="addArtifactLayer()">
                Add to Capsule
            </button>
        </div>
    </div>

    <!-- View Capsule Modal -->
    <div class="modal" id="viewCapsuleModal">
        <div class="modal-content">
            <button class="close-modal" onclick="closeViewModal()">×</button>
            <div id="viewModalBody"></div>
        </div>
    </div>

    // API Configuration
const API_BASE_URL = 'http://localhost:8000/api';
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').content;

// API Helper Functions
const api = {
    get: async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': CSRF_TOKEN
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    },
    
    post: async (endpoint, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': CSRF_TOKEN
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    },
    
    delete: async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': CSRF_TOKEN
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API DELETE Error:', error);
            throw error;
        }
    }
};

// Toast notification helper
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast') || createToastElement();
    toast.textContent = message;
    toast.className = `toast ${type} active`;
    setTimeout(() => toast.classList.remove('active'), 3000);
}

function createToastElement() {
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
    return toast;
}

// Loading overlay helpers
function showLoading() {
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="spinner-large"></div>';
        document.body.appendChild(overlay);
    }
    overlay.classList.add('active');
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.remove('active');
}

// ============================================
// REPLACE OLD STORAGE FUNCTIONS WITH API CALLS
// ============================================

// Load historical data from YOUR Laravel APIs
async function loadHistoricalData(year) {
    try {
        showLoading();
        
        // Check your routes - adjust endpoint if needed
        // Common endpoints: /historical/year, /events/year, /weather
        const response = await api.get(`/events/year?year=${year}`);
        
        if (response.success) {
            const eventsData = response.data;
            
            // Get weather data
            const weatherResponse = await api.get(`/weather?year=${year}`);
            
            displayHistoricalData({
                events: eventsData.events || [],
                weather: weatherResponse.success ? weatherResponse.data : null
            });
        } else {
            displayError();
        }
    } catch (error) {
        console.error('Error loading historical data:', error);
        displayError();
    } finally {
        hideLoading();
    }
}

// Load buried capsules from Laravel backend
async function loadBuriedCapsules() {
    try {
        const response = await api.get('/capsules');
        
        if (response.success) {
            buriedCapsules = response.data;
            renderBuriedCapsules();
        } else {
            console.error('Failed to load capsules');
        }
    } catch (error) {
        console.error('Error loading capsules:', error);
        buriedCapsules = [];
        renderBuriedCapsules();
    }
}

// Bury capsule - save to Laravel backend
async function buryCapsule() {
    const name = document.getElementById('capsuleName').value;
    const revealDate = document.getElementById('revealDate').value;
    const message = document.getElementById('personalMessage').value;
    const recipients = document.getElementById('recipients').value;
    const isPublic = document.getElementById('publicCapsule').checked;

    // Validation
    if (!name || !revealDate || !message) {
        showToast('Please fill in capsule name, reveal date, and personal message', 'error');
        return;
    }

    if (currentArtifacts.length === 0) {
        showToast('Please add at least one artifact to your capsule', 'error');
        return;
    }

    try {
        showLoading();
        
        const capsuleData = {
            name: name,
            reveal_date: revealDate,
            message: message,
            artifacts: currentArtifacts,
            recipients: recipients.split(',').map(e => e.trim()).filter(e => e),
            is_public: isPublic
        };

        const response = await api.post('/capsules', capsuleData);

        if (response.success) {
            // Reset form
            document.getElementById('capsuleName').value = '';
            document.getElementById('revealDate').value = '';
            document.getElementById('personalMessage').value = '';
            document.getElementById('recipients').value = '';
            document.getElementById('publicCapsule').checked = false;
            currentArtifacts = [];
            
            renderArtifactLayers();
            updateContentsPreview();
            await loadBuriedCapsules();
            
            const date = new Date(revealDate).toLocaleDateString();
            showToast(`🎉 Time capsule buried successfully! Opens on ${date}`, 'success');
        } else {
            showToast('Error burying capsule: ' + (response.message || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Bury capsule error:', error);
        showToast('Error burying capsule: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// View capsule details
async function viewCapsule(id, isUnlocked) {
    try {
        showLoading();
        
        const response = await api.get(`/capsules/${id}`);
        
        if (!response.success) {
            showToast('Error loading capsule', 'error');
            return;
        }

        const capsule = response.data;
        const modal = document.getElementById('viewCapsuleModal');
        const modalBody = document.getElementById('viewModalBody');

        if (!isUnlocked) {
            // Show locked view
            modalBody.innerHTML = `
                <div class="locked-message">
                    <div class="lock-icon">🔒</div>
                    <h3>Time Capsule: ${capsule.name}</h3>
                    <div class="locked-info">
                        <p>This capsule is still sealed and locked.</p>
                        <p style="font-size: 1.4em; color: #667eea; margin: 20px 0;">
                            Opens on ${new Date(capsule.reveal_date).toLocaleDateString()}
                        </p>
                        <p>${capsule.countdown}</p>
                        <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                            <strong>Capsule contains:</strong><br>
                            ${capsule.artifacts_count || 0} artifact${(capsule.artifacts_count || 0) !== 1 ? 's' : ''}<br>
                            1 personal message
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Show unlocked view with full content
            let artifactsHTML = '';
            if (capsule.artifacts && capsule.artifacts.length > 0) {
                artifactsHTML = capsule.artifacts.map(artifact => `
                    <div class="artifact-showcase">
                        <h4>${artifact.title} <span class="artifact-type-badge">${artifact.type}</span></h4>
                        <div style="color: #ccc; font-size: 0.9em; margin-bottom: 10px;">
                            📅 ${artifact.year} • 📚 ${artifact.source}
                        </div>
                        <div class="artifact-text">${artifact.content}</div>
                    </div>
                `).join('');
            }

            modalBody.innerHTML = `
                <div class="modal-header">
                    <h2 class="modal-title">🔓 ${capsule.name}</h2>
                    <p style="color: #ccc;">Buried on ${new Date(capsule.created_date).toLocaleDateString()}</p>
                </div>
                
                <div class="personal-message">
                    <h3>💌 Your Message</h3>
                    <p>${capsule.message}</p>
                </div>

                <h3 style="color: #E6D5B8; margin-bottom: 20px; font-size: 1.6em;">📦 Artifacts</h3>
                ${artifactsHTML}
            `;
        }

        modal.classList.add('active');
    } catch (error) {
        console.error('View capsule error:', error);
        showToast('Error loading capsule', 'error');
    } finally {
        hideLoading();
    }
}

// Delete capsule
async function deleteCapsule(id) {
    if (!confirm('Are you sure you want to delete this time capsule? This cannot be undone.')) {
        return;
    }

    try {
        showLoading();
        
        const response = await api.delete(`/capsules/${id}`);
        
        if (response.success) {
            await loadBuriedCapsules();
            showToast('Time capsule deleted successfully', 'success');
        } else {
            showToast('Error deleting capsule', 'error');
        }
    } catch (error) {
        console.error('Delete capsule error:', error);
        showToast('Error deleting capsule: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

    <script>
        // Global state
        let currentYear = 2024;
        let currentArtifacts = [];
        let buriedCapsules = [];
        let historicalCache = {};

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            loadBuriedCapsules();
            loadHistoricalData(currentYear);
            document.getElementById('revealDate').min = new Date().toISOString().split('T')[0];
        });

        // Smooth scroll
        function scrollToTimeline() {
            document.getElementById('timeline-section').scrollIntoView({ behavior: 'smooth' });
        }

        // Year selection
        function selectYear(year) {
            currentYear = year;
            document.getElementById('currentYearDisplay').textContent = year;
            document.querySelectorAll('.year-option').forEach(el => el.classList.remove('active'));
            event.target.classList.add('active');
            loadHistoricalData(year);
        }

        function loadCustomYear() {
            const year = parseInt(document.getElementById('customYear').value);
            if (year >= 1800 && year <= 2024) {
                selectYear(year);
            } else {
                alert('Please enter a year between 1800 and 2024');
            }
        }

        // Load historical data from APIs
        async function loadHistoricalData(year) {
            // Check cache first
            if (historicalCache[year]) {
                displayHistoricalData(historicalCache[year]);
                return;
            }

            try {
                // Wikipedia Events (On This Day API)
                const today = new Date();
                const month = today.getMonth() + 1;
                const day = today.getDate();
                
                const wikiResponse = await fetch(
                    `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`
                );
                const wikiData = await wikiResponse.json();
                
                // Filter events for the selected year
                const yearEvents = wikiData.events?.filter(e => 
                    e.year === year || Math.abs(e.year - year) <= 5
                ) || [];

                // Weather API (Open-Meteo Historical)
                const weatherResponse = await fetch(
                    `https://archive-api.open-meteo.com/v1/archive?latitude=40.7128&longitude=-74.0060&start_date=${year}-01-01&end_date=${year}-12-31&daily=temperature_2m_max,temperature_2m_min&timezone=America/New_York`
                );
                const weatherData = await weatherResponse.json();

                const historicalData = {
                    events: yearEvents,
                    weather: weatherData
                };

                historicalCache[year] = historicalData;
                displayHistoricalData(historicalData);

            } catch (error) {
                console.error('Error loading historical data:', error);
                displayError();
            }
        }

        function displayHistoricalData(data) {
            // Display Wikipedia events
            const eventsContainer = document.getElementById('wikipediaEvents');
            if (data.events && data.events.length > 0) {
                eventsContainer.innerHTML = '';
                data.events.slice(0, 5).forEach(event => {
                    const eventDiv = document.createElement('div');
                    eventDiv.className = 'api-content';
                    eventDiv.onclick = () => addHistoricalEvent(event);
                    eventDiv.innerHTML = `
                        <div class="api-item">
                            <strong>${event.year}:</strong> ${event.text}
                        </div>
                    `;
                    eventsContainer.appendChild(eventDiv);
                });
            } else {
                eventsContainer.innerHTML = '<div class="api-content"><div class="api-item">No events found for this year</div></div>';
            }

            // Display weather data
            const weatherContainer = document.getElementById('weatherData');
            if (data.weather && data.weather.daily) {
                const avgMaxTemp = data.weather.daily.temperature_2m_max?.reduce((a, b) => a + b, 0) / data.weather.daily.temperature_2m_max?.length || 0;
                const avgMinTemp = data.weather.daily.temperature_2m_min?.reduce((a, b) => a + b, 0) / data.weather.daily.temperature_2m_min?.length || 0;
                
                weatherContainer.innerHTML = `
                    <div class="api-content">
                        <div class="api-item">
                            <strong>Average High:</strong> ${avgMaxTemp.toFixed(1)}°C<br>
                            <strong>Average Low:</strong> ${avgMinTemp.toFixed(1)}°C
                        </div>
                        <button class="load-btn" onclick="addWeatherData(${avgMaxTemp.toFixed(1)}, ${avgMinTemp.toFixed(1)})">Add to Capsule</button>
                    </div>
                `;
            } else {
                weatherContainer.innerHTML = '<div class="api-content"><div class="api-item">Weather data unavailable</div></div>';
            }
        }

        function displayError() {
            document.getElementById('wikipediaEvents').innerHTML = '<div class="api-content"><div class="api-item">Unable to load historical data</div></div>';
            document.getElementById('weatherData').innerHTML = '<div class="api-content"><div class="api-item">Unable to load weather data</div></div>';
        }

        function addHistoricalEvent(event) {
            currentArtifacts.push({
                type: 'historical',
                title: `${event.year}: ${event.text.substring(0, 50)}...`,
                year: event.year,
                content: event.text,
                source: 'Wikipedia'
            });
            renderArtifactLayers();
            updateContentsPreview();
        }

        function addWeatherData(high, low) {
            currentArtifacts.push({
                type: 'historical',
                title: `Weather Data for ${currentYear}`,
                year: currentYear,
                content: `Average temperatures: High ${high}°C, Low ${low}°C`,
                source: 'Open-Meteo'
            });
            renderArtifactLayers();
            updateContentsPreview();
        }

        function loadEconomicData() {
            alert('Economic data API integration would connect to services like Alpha Vantage or similar historical financial data providers. Add your API key to enable this feature.');
        }

        // Artifact Layer Management
        function openAddLayerModal() {
            document.getElementById('addLayerModal').classList.add('active');
            document.getElementById('artifactYear').value = currentYear;
        }

        function closeAddLayerModal() {
            document.getElementById('addLayerModal').classList.remove('active');
            document.getElementById('artifactTitle').value = '';
            document.getElementById('artifactContent').value = '';
        }

        function addArtifactLayer() {
            const type = document.getElementById('artifactType').value;
            const title = document.getElementById('artifactTitle').value;
            const year = parseInt(document.getElementById('artifactYear').value);
            const content = document.getElementById('artifactContent').value;

            if (!title || !content) {
                alert('Please fill in both title and content');
                return;
            }

            currentArtifacts.push({
                type,
                title,
                year: year || currentYear,
                content,
                source: 'User Created'
            });

            closeAddLayerModal();
            renderArtifactLayers();
            updateContentsPreview();
        }

        function renderArtifactLayers() {
            const stack = document.getElementById('layerStack');
            
            if (currentArtifacts.length === 0) {
                stack.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🏺</div>
                        <p>No artifacts yet.<br>Add historical events or personal memories!</p>
                    </div>
                `;
                return;
            }

            stack.innerHTML = '';
            
            currentArtifacts.forEach((artifact, index) => {
                const age = 2024 - artifact.year;
                const isOld = age > 50;
                
                const layerDiv = document.createElement('div');
                layerDiv.className = `artifact-layer ${isOld ? 'sepia' : ''}`;
                layerDiv.innerHTML = `
                    <div class="layer-content">
                        <div class="layer-info">
                            <div class="layer-title">${artifact.title}</div>
                            <div class="layer-meta">
                                ${artifact.year} • ${artifact.type} • ${artifact.source}
                            </div>
                            <div class="layer-description">${artifact.content.substring(0, 150)}${artifact.content.length > 150 ? '...' : ''}</div>
                        </div>
                        <div class="layer-actions">
                            <button class="layer-btn" onclick="removeArtifact(${index})">🗑️ Remove</button>
                        </div>
                    </div>
                `;
                stack.appendChild(layerDiv);
            });
        }

        function removeArtifact(index) {
            currentArtifacts.splice(index, 1);
            renderArtifactLayers();
            updateContentsPreview();
        }

        function updateContentsPreview() {
            const contentsList = document.getElementById('contentsList');
            
            if (currentArtifacts.length === 0) {
                contentsList.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No artifacts added yet</p>';
                return;
            }

            contentsList.innerHTML = currentArtifacts.map(artifact => 
                `<span class="content-chip">${artifact.title}</span>`
            ).join('');
        }

        // Bury Capsule
        async function buryCapsule() {
            const name = document.getElementById('capsuleName').value;
            const revealDate = document.getElementById('revealDate').value;
            const message = document.getElementById('personalMessage').value;
            const recipients = document.getElementById('recipients').value;
            const isPublic = document.getElementById('publicCapsule').checked;

            if (!name || !revealDate || !message) {
                alert('Please fill in capsule name, reveal date, and personal message');
                return;
            }

            if (currentArtifacts.length === 0) {
                alert('Please add at least one artifact to your capsule');
                return;
            }

            const capsule = {
                id: Date.now(),
                name,
                revealDate,
                message,
                artifacts: [...currentArtifacts],
                recipients: recipients.split(',').map(e => e.trim()).filter(e => e),
                isPublic,
                createdDate: new Date().toISOString(),
                buried: true
            };

            try {
                await window.storage.set(`capsule:${capsule.id}`, JSON.stringify(capsule));
                buriedCapsules.push(capsule);
                
                // Reset form
                document.getElementById('capsuleName').value = '';
                document.getElementById('revealDate').value = '';
                document.getElementById('personalMessage').value = '';
                document.getElementById('recipients').value = '';
                document.getElementById('publicCapsule').checked = false;
                currentArtifacts = [];
                
                renderArtifactLayers();
                updateContentsPreview();
                renderBuriedCapsules();
                
                // Show success animation
                alert('🎉 Time capsule buried successfully! It will reveal on ' + new Date(revealDate).toLocaleDateString());
                
            } catch (error) {
                alert('Error burying capsule: ' + error.message);
            }
        }

        // Load buried capsules
        async function loadBuriedCapsules() {
            try {
                const result = await window.storage.list('capsule:');
                if (result && result.keys) {
                    buriedCapsules = [];
                    for (const key of result.keys) {
                        try {
                            const data = await window.storage.get(key);
                            if (data && data.value) {
                                buriedCapsules.push(JSON.parse(data.value));
                            }
                        } catch (err) {
                            console.log('Key not found:', key);
                        }
                    }
                    renderBuriedCapsules();
                }
            } catch (error) {
                console.log('No capsules found yet');
                renderBuriedCapsules();
            }
        }

        function renderBuriedCapsules() {
            const grid = document.getElementById('capsulesArchive');
            
            if (buriedCapsules.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">⏳</div>
                        <p>No buried capsules yet.<br>Create your first time capsule!</p>
                    </div>
                `;
                return;
            }

            grid.innerHTML = '';
            
            buriedCapsules.sort((a, b) => new Date(a.revealDate) - new Date(b.revealDate)).forEach(capsule => {
                const isUnlocked = new Date() >= new Date(capsule.revealDate);
                const countdown = getCountdown(capsule.revealDate);
                
                const card = document.createElement('div');
                card.className = `capsule-card ${isUnlocked ? 'unlocked' : 'locked'}`;
                card.innerHTML = `
                    <div class="capsule-name">${capsule.name}</div>
                    <div class="capsule-info">
                        📅 Created: ${new Date(capsule.createdDate).toLocaleDateString()}<br>
                        📦 Artifacts: ${capsule.artifacts.length}<br>
                        ${capsule.recipients.length > 0 ? `📧 Recipients: ${capsule.recipients.length}<br>` : ''}
                        ${capsule.isPublic ? '🌐 Public<br>' : '🔒 Private<br>'}
                    </div>
                    <span class="status-indicator ${isUnlocked ? 'unlocked' : 'locked'}">
                        ${isUnlocked ? '🔓 Unlocked' : '🔒 Locked'}
                    </span>
                    ${!isUnlocked ? `<div class="countdown-display">${countdown}</div>` : ''}
                    <div class="capsule-info">🗓️ Opens: ${new Date(capsule.revealDate).toLocaleDateString()}</div>
                    <div class="capsule-actions">
                        <button class="action-btn primary" onclick="viewCapsule(${capsule.id}, ${isUnlocked})">
                            ${isUnlocked ? '👁️ View' : '🔍 Peek'}
                        </button>
                        <button class="action-btn danger" onclick="deleteCapsule(${capsule.id})">
                            🗑️ Delete
                        </button>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        function getCountdown(revealDate) {
            const now = new Date();
            const reveal = new Date(revealDate);
            const diff = reveal - now;
            
            if (diff <= 0) return 'Ready to open!';
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (days > 0) return `⏳ ${days}d ${hours}h ${minutes}m`;
            if (hours > 0) return `⏳ ${hours}h ${minutes}m`;
            return `⏳ ${minutes}m`;
        }

        function viewCapsule(id, isUnlocked) {
            const capsule = buriedCapsules.find(c => c.id === id);
            if (!capsule) return;

            const modal = document.getElementById('viewCapsuleModal');
            const modalBody = document.getElementById('viewModalBody');

            if (!isUnlocked) {
                modalBody.innerHTML = `
                    <div class="locked-message">
                        <div class="lock-icon">🔒</div>
                        <h3>Time Capsule: ${capsule.name}</h3>
                        <div class="locked-info">
                            <p>This capsule is still sealed and locked.</p>
                            <p style="font-size: 1.4em; color: #667eea; margin: 20px 0;">
                                Opens on ${new Date(capsule.revealDate).toLocaleDateString()}
                            </p>
                            <p>${getCountdown(capsule.revealDate)}</p>
                            <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                                <strong>Capsule contains:</strong><br>
                                ${capsule.artifacts.length} artifact${capsule.artifacts.length !== 1 ? 's' : ''}<br>
                                1 personal message
                            </div>
                        </div>
                    </div>
                `;
            } else {
                let artifactsHTML = '';
                capsule.artifacts.forEach(artifact => {
                    artifactsHTML += `
                        <div class="artifact-showcase">
                            <h4>${artifact.title} <span class="artifact-type-badge">${artifact.type}</span></h4>
                            <div style="color: #ccc; font-size: 0.9em; margin-bottom: 10px;">
                                📅 ${artifact.year} • 📚 ${artifact.source}
                            </div>
                            <div class="artifact-text">${artifact.content}</div>
                        </div>
                    `;
                });

                modalBody.innerHTML = `
                    <div class="modal-header">
                        <h2 class="modal-title">🔓 ${capsule.name}</h2>
                        <p style="color: #ccc;">Buried on ${new Date(capsule.createdDate).toLocaleDateString()}</p>
                    </div>
                    
                    <div class="personal-message">
                        <h3>💌 Your Message</h3>
                        <p>${capsule.message}</p>
                    </div>

                    <h3 style="color: #E6D5B8; margin-bottom: 20px; font-size: 1.6em;">📦 Artifacts</h3>
                    ${artifactsHTML}
                `;
            }

            modal.classList.add('active');
        }

        function closeViewModal() {
            document.getElementById('viewCapsuleModal').classList.remove('active');
        }

        async function deleteCapsule(id) {
            if (!confirm('Are you sure you want to delete this time capsule? This cannot be undone.')) {
                return;
            }

            try {
                await window.storage.delete(`capsule:${id}`);
                buriedCapsules = buriedCapsules.filter(c => c.id !== id);
                renderBuriedCapsules();
            } catch (error) {
                alert('Error deleting capsule: ' + error.message);
            }
        }

        // Close modals on outside click
        document.getElementById('addLayerModal').addEventListener('click', (e) => {
            if (e.target.id === 'addLayerModal') closeAddLayerModal();
        });

        document.getElementById('viewCapsuleModal').addEventListener('click', (e) => {
            if (e.target.id === 'viewCapsuleModal') closeViewModal();
        });

        // Update countdowns every minute
        setInterval(renderBuriedCapsules, 60000);
    </script>
</body>
</html>