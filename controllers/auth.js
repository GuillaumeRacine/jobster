const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  
  res.status(StatusCodes.CREATED).json({ 
    user: { 
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      token 
    }
  })
};

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ 
    user: { 
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      token 
    }
  })
}

const updateUser = async (req, res) => {
  const {email, name, lastName, location} = req.body
  console.log(req.user);
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please provide email, name, lastName and location')
  }
  const user = await User.findOne({ _id: req.user.userId});

  user.email = email
  user.name = name
  user.lastName = lastName
  user.location = location

  await user.save()
  // create new token since it is tied to the name (name change = new token)
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      token
    }
  })
  
  
  console.log(req.user)
  console.log(req.body)
}

module.exports = {
  register,
  login,
  updateUser,
}
