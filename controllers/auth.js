const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
// const bcrypt = require('')


const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT();
    res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
    // console.log('Request Body:', req.body);
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError("Please provide email and password")
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials: user not found')
    }
    // compare password
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials: password is not correct')
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })

}

module.exports = {
    register,
    login
}