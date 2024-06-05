import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/schema';

const router = express.Router();

router.post('/Signup', async (req, res) => {
    const { Fname, Lname, Phone, Designation, Email, Password, role} = req.body;

    if (!Fname || !Lname || !Phone || !Designation || !Email || !Password) {
        return res.status(422).json({ error: "Please fill properly." });
    }

    try {
        const UserExist = await User.findOne({ Email: Email });

        if (UserExist) {
            return res.status(422).json({ error: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);
        const userRole = role || 'user';
        const user = new User({ Fname, Lname, Phone, Designation, Email, Password: hashedPassword, role : userRole  });

        await user.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to sign up." });
    }
});

router.post('/Frontpg', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please fill in all fields." });
    }

    try {
        const user = await User.findOne({ Email: email });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.Password);

        if (isMatch) {
            // Respond with the user's role
            return res.status(200).json({ message: "Login successful.", role: user.role, user});
        } else {
            return res.status(401).json({ error: "Invalid password." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
router.get('/api/users', async (req, res) => {    //cards milne ke liye yahase get
    try {
        const users = await User.find().select('-Password'); // Exclude password field
        res.status(200).json({ users });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch users." });
    }
});

router.get('/api/current-user', async (req, res) => {
    const email = req.query.email; 
    if (!email) {
        return res.status(400).json({ error: "Email parameter is missing." });
    }

    try {
        const user = await User.findOne({ Email: email }).select('-Password');
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch user data." });
    }
});

router.put('/api/users/:id', async (req, res) => {       //mongodb pe add karne ke liye yahase put
    const userId = req.params.id;
    const { additionalInfo } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { additionalInfo },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "User information updated successfully.", user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update user information." });
    }
});

export default router;
