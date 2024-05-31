const User = require('../models/user');
const Joi = require('joi');

exports.getProfile = async (req, res) => {
    if (req.session.authenticated) {
        const result = await User.findOne({ username: req.session.username });
        
        if (!result) {
            res.send("User not found");
            return;
        }

        res.render("profile", {user: result});
    } else {
        res.render("login");
    }
};

exports.updateProfile = async (req, res) => {
    var email = req.params.email;
    var address = req.body.address;
    var city = req.body.city;
    var province = req.body.province;
    var postal = req.body.postal;

    const schema = Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: false } }).required().messages({
                'string.base': 'Email must be a string',
                'string.empty': 'Email is required',
                'string.email': 'Email must be a valid email',
                'string.domain': 'Email must be a valid email'
            }),
        address: Joi.string().trim().required().messages({
            'any.required': 'Address is required.',
            'string.empty': 'Address cannot be empty.'
        }),
        city: Joi.string().trim().required().messages({
            'any.required': 'City is required.',
            'string.empty': 'City cannot be empty.'
        }),
        province: Joi.string().trim().required().messages({
            'any.required': 'Province is required.',
            'string.empty': 'Province cannot be empty.'
        }),
        postal: Joi.string().trim().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)
            .required().messages({
                'any.required': 'Postal code is required.',
                'string.empty': 'Postal code cannot be empty.',
                'string.pattern.base': 'Postal code must be a valid Canadian postal code.'
            })
    });

    const validationResult = schema.validate({ email, address, city, province, postal }, { abortEarly: false });
    if (validationResult.error != null) {
        let errorMessages = validationResult.error.details.map(detail => detail.message);
        res.redirect('/profile?errors=' + encodeURIComponent(JSON.stringify(errorMessages)));
        return;
    }

    await User.updateOne({ email: email }, 
        { $set: { 
            address: req.body.address,
            city: req.body.city,
            province: req.body.province,
            postal: req.body.postal
        }});

    res.redirect('/profile');
};