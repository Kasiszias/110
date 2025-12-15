<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login - Time Capsule</title>
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
        }
        .container {
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 15px;
            max-width: 400px;
            width: 100%;
            backdrop-filter: blur(10px);
        }
        h2 { text-align: center; margin-bottom: 30px; font-size: 2em; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; color: #E6D5B8; }
        input {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 2px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.9);
            font-size: 1em;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
        }
        button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1em;
            font-weight: bold;
            margin-top: 10px;
        }
        button:hover { opacity: 0.9; }
        a { color: #667eea; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .error {
            background: rgba(255,71,87,0.2);
            border: 1px solid #ff4757;
            color: #ff4757;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .text-center { text-align: center; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>⏳ Login</h2>
        
        @if ($errors->any())
            <div class="error">
                @foreach ($errors->all() as $error)
                    {{ $error }}<br>
                @endforeach
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}">
    @csrf
    
    <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" value="{{ old('email') }}" required autofocus placeholder="your@email.com">
    </div>

    <div class="form-group">
        <label>Password</label>
        <input type="password" name="password" required placeholder="Enter your password">
    </div>

    <!-- ADD THIS SECTION -->
    <div class="form-group" style="display: flex; align-items: center; margin-bottom: 15px;">
        <input type="checkbox" name="remember" id="remember" style="width: auto; margin-right: 8px; transform: scale(1.2);">
        <label for="remember" style="margin-bottom: 0; color: #ccc; font-size: 0.9em;">Remember me</label>
    </div>
    <!-- END OF ADDED SECTION -->

    <button type="submit">Login</button>
</form>
        
        <p class="text-center">
            Don't have an account? <a href="{{ route('register') }}">Register</a>
        </p>
    </div>
</body>
</html>