const express = require('express')
const router = express.Router();
const {User} = require("../models/index");
const bcrypt = require('bcryptjs');
const {body, validationResult} = require('express-validator');
const {Op} = require("sequelize");

const userValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }else{
        next();
    }
}

router.post('/register',
    body('login').isLength({min: 3}).withMessage('Min login length should be > 3'),
    body('password').isLength({min: 4}).withMessage('Min password length should be > 4'),
    userValidation,
    async (req, res) => {
            try{
                let hash = bcrypt.hashSync(req.body.password, 10);
                const result = await User.create({
                    login: req.body.login,
                    password: hash
                });
                const verified = bcrypt.compareSync(req.body.password, hash);
                console.log(`verified ${verified}`);
                return res.status(200).json({ result });
            }catch (e){
                console.log(`[ User registration ]: ${e}`);
            }
});

router.post('/login',
    body('login').isLength({min: 3}).withMessage('Min login length should be > 3'),
    body('password').isLength({min: 4}).withMessage('Min password length should be > 4'),
    userValidation,
    async (req, res) => {
        try{
            const user = await User.findOne({
                where: {
                    login: {
                        [Op.eq]: req.body.login
                    }
                }
            });

            if (!user) {
                return res.status(404).send('User not founded');
            }

            const verified = bcrypt.compareSync(req.body.password, user.dataValues.password);

            if (verified) {
                req.session.auth = true;
            }else {
                return res.status(404).send('Login or Password incorrect');
            }

            console.log(`verified ${req.session.auth}`);
            return res.status(200).send('verified');
        }catch (e){
            console.log(`[ User login ]: ${e}`);
        }
});


module.exports = router;
