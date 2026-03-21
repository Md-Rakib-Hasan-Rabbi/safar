const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    try {
        console.log("req.body ===>", req.body);
        const { name, email, phone, gender, userType, password, confirmPassword } = req.body;

        // Enhanced validation
        if (!name || !email || !phone || !gender || !userType || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Validate gender enum
        if (!['Male', 'Female', 'Other'].includes(gender)) {
            return res.status(400).json({ message: 'Invalid gender selection' });
        }

        // Validate userType enum
        if (!['Admin', 'Rider', 'Driver'].includes(userType)) {
            return res.status(400).json({ message: 'Invalid user type selection' });
        }

        // Check if user already exists by email or phone
        const [existingEmail] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const [existingPhone] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
        
        if (existingEmail.length > 0) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        if (existingPhone.length > 0) {
            return res.status(409).json({ message: 'Phone number already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user with all fields
        const [result] = await db.query(
            'INSERT INTO users (name, email, phone, gender, password, UserType) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, phone, gender, hashedPassword, userType]
        );

        // Omit password from response
        const newUser = {
            userId: result.insertId,
            name,
            email,
            phone,
            gender,
            userType
        };

        res.status(201).json({ 
            message: 'User created successfully',
            user: newUser
        });

    } catch (error) {
        console.error('Signup error:', error);
        
        // Handle specific database errors
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'User with this email or phone already exists' });
        }
        
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
  try {
        const { email, password, userType } = req.body;

        if (!email || !password || !userType) {
            return res.status(400).json({ message: "Email, password and role are required" });
        }

        if (!['Admin', 'Rider', 'Driver'].includes(userType)) {
            return res.status(400).json({ message: 'Invalid user role selection' });
    }

    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

        if (user.UserType !== userType) {
            return res.status(403).json({ message: 'Selected role does not match this account' });
        }

    // Remove password before sending
    delete user.password;
    res.json({ user });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};