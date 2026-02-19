const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (userData) => {
    const { email, password, name } = userData;

    // 1. ตรวจสอบว่ามีผู้ใช้นี้ใน Database หรือยัง (ใช้ where สำหรับ Sequelize)
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        throw new Error('User already exists');
    }

    // 2. Hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. บันทึกลง Database
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return { id: user.id, email: user.email, name: user.name };
};

const login = async (email, password) => {
    // 1. ค้นหาผู้ใช้ (ใช้ where สำหรับ Sequelize)
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // 2. เช็ครหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // 3. สร้าง Token
    const token = jwt.sign(
    { 
        id: user.id,
        email: user.email,
        role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);


    return { 
        user: { id: user.id, email: user.email, name: user.name }, 
        token 
    };
};

module.exports = { register, login };