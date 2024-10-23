const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async(req, res = response) => {

    const { email, password } = req.body;
    
    try {

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                ok: false,
                message: 'The user already exists'
            });
        }

        user = new User(req.body);

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // Generate JWT
        const token = await generateJWT(user.id, user.name);

        res.status(201).json({ 
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
     
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Please contact the administrator'
        });
    }
}

const userLogin = async(req, res = response) => {
    
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'Email or password incorrect'
            });
        }

        // Confirm passwords
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'Email or password incorrect'
            });
        }

        // Generate JWT
        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Please contact the administrator'
        });
    }
}

const renewUserToken = async(req, res = response) => {

    const { uid, name } = req;

    // Generate JWT
    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    });
}

module.exports = {
    createUser,
    userLogin,
    renewUserToken
}