const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const userReg = await User.create({ ...req.body })
  const token = userReg.createJWT()
  res.status(StatusCodes.CREATED).json({
    user: {
      name: userReg.name,
      email: userReg.email,
      lastName: userReg.lastName,
      location: userReg.location,
      token,
    },
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const userLog = await User.findOne({ email })
  if (!userLog) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await userLog.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const token = userLog.createJWT()
  res.status(StatusCodes.OK).json({
    user: {
      name: userLog.name,
      email: userLog.email,
      lastName: userLog.lastName,
      location: userLog.location,
      token,
    },
  })
}

const updateUser = async (req, res) => {
  // console.log({ user: req.user })
  const {
    user: { userId },
    body: { email, name, lastName, location },
  } = req

  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please provide all value')
  }

  const userUpdate = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  })

  if (!userUpdate) {
    throw new BadRequestError('Not found user to update')
  }

  const token = userUpdate.createJWT()
  res.status(StatusCodes.OK).json({
    user: {
      name: userUpdate.name,
      email: userUpdate.email,
      lastName: userUpdate.lastName,
      location: userUpdate.location,
      token,
    },
  })
}

module.exports = {
  register,
  login,
  updateUser,
}
