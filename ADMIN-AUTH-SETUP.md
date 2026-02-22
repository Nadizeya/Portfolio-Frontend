# Admin Authentication Setup Guide

## What You Need to Prepare on Backend

### 1. **Create Authentication Endpoint**

Add this endpoint to your backend API:

**POST** `/api/auth/login`

Request Body:

```json
{
  "username": "admin",
  "password": "your-secure-password"
}
```

Response (Success):

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

Response (Failure):

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 2. **Environment Variables for Backend**

Add these to your backend `.env` file:

```env
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here

# JWT Secret (generate a random 256-bit string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# JWT Expiration (e.g., 24 hours)
JWT_EXPIRES_IN=24h
```

---

### 3. **Backend Implementation Example (Node.js/Express)**

#### Install Dependencies:

```bash
npm install jsonwebtoken bcryptjs
```

#### Create `auth.controller.js`:

```javascript
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Login endpoint
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Check credentials (for single admin user)
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Should be hashed in production

    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password (use bcrypt in production)
    // const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD);
    const isValidPassword = password === ADMIN_PASSWORD; // Simplified for demo

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        username: ADMIN_USERNAME,
        role: "admin",
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    );

    res.json({
      success: true,
      token,
      user: {
        username: ADMIN_USERNAME,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
```

#### Add route in `routes/auth.routes.js`:

```javascript
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.login);

module.exports = router;
```

#### Register route in your main `server.js` or `app.js`:

```javascript
const authRoutes = require("./routes/auth.routes");

app.use("/api/auth", authRoutes);
```

---

### 4. **Middleware to Protect Admin Routes**

Create `middleware/auth.middleware.js`:

```javascript
const jwt = require("jsonwebtoken");

exports.authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
```

#### Use the middleware on admin routes:

```javascript
const { authenticateAdmin } = require("./middleware/auth.middleware");

// Protect these routes
router.put("/api/skills/:id", authenticateAdmin, skillsController.update);
router.delete("/api/skills/:id", authenticateAdmin, skillsController.delete);
router.post("/api/projects", authenticateAdmin, projectsController.create);
// etc...
```

---

### 5. **Security Best Practices**

#### Hash Password (Production):

```javascript
const bcrypt = require("bcryptjs");

// When setting up admin password
const hashedPassword = await bcrypt.hash("your-password", 10);
// Store hashedPassword in .env as ADMIN_PASSWORD

// When checking password in login
const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);
```

#### Generate Strong JWT Secret:

```bash
# In terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Add Rate Limiting:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, please try again later",
});

router.post("/login", loginLimiter, authController.login);
```

---

## Frontend Admin Routes

✅ **Created Routes:**

- `/admin` - Login page
- `/admin/dashboard` - Protected admin dashboard

✅ **Created Components:**

- `AdminLogin.tsx` - Login screen
- `AdminDashboard.tsx` - Main admin panel
- `ProtectedRoute.tsx` - Route guard
- `authService.ts` - Authentication logic

---

## Testing the Login

### Quick Test Credentials:

1. Set in your backend `.env`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

2. Start your backend:

```bash
npm run dev
```

3. Start your frontend:

```bash
npm run dev
```

4. Navigate to: `http://localhost:5173/admin`

5. Login with:
   - Username: `admin`
   - Password: `admin123`

---

## Next Steps for Admin Dashboard

Once logged in, you can add CRUD pages for:

- Managing Projects
- Managing Skills
- Managing Experiences
- Viewing Contact Messages
- Uploading Images

Would you like me to create any of these admin management pages?
