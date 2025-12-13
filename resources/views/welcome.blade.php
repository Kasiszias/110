<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Time Capsule Creator - Preserve Your Memories</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            text-align: center;
            padding: 20px;
        }
        .container { max-width: 800px; }
        .logo { font-size: 6em; margin-bottom: 20px; animation: float 3s ease-in-out infinite; }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        h1 {
            font-size: 3.5em;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        p { font-size: 1.5em; margin-bottom: 40px; color: #ccc; }
        .buttons { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
        .btn {
            padding: 18px 45px;
            border-radius: 12px;
            text-decoration: none;
            font-size: 1.2em;
            font-weight: bold;
            transition: all 0.3s;
            display: inline-block;
        }
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        .btn-secondary {
            background: rgba(255,255,255,0.1);
            color: white;
            border: 2px solid white;
        }
        .btn:hover { transform: translateY(-3px); }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 60px;
        }
        .feature {
            background: rgba(255,255,255,0.05);
            padding: 25px;
            border-radius: 15px;
            border: 2px solid rgba(102, 126, 234, 0.3);
        }
        .feature-icon { font-size: 2.5em; margin-bottom: 10px; }
        .feature h3 { color: #FFD700; margin-bottom: 10px; }
        .feature p { font-size: 0.9em; color: #ccc; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">⏳</div>
        <h1>Time Capsule Creator</h1>
        <p>Preserve your memories and unlock them in the future</p>
        
        <div class="buttons">
            <a href="{{ route('login') }}" class="btn btn-primary">Login</a>
            <a href="{{ route('register') }}" class="btn btn-secondary">Create Account</a>
        </div>

        <div class="features">
            <div class="feature">
                <div class="feature-icon">📦</div>
                <h3>Create Capsules</h3>
                <p>Bundle memories, letters, and artifacts</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🔒</div>
                <h3>Lock & Schedule</h3>
                <p>Set a reveal date for the future</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🎉</div>
                <h3>Unlock Memories</h3>
                <p>Relive your past when the time comes</p>
            </div>
        </div>
    </div>
</body>
</html>