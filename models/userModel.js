const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
//name email photo password passwordConfirm

const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'Name must have less or equal to 40 characters'],
    // minLength: [10, 'Name should be minimum 10 characters'],
    validate: [validator.isAlpha, 'Name should only contain alphanumeric characters'],
  },
  email: {
    type: String,
    required: [true, 'Email in required'],
    trim: true,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Email not correct'],
  },
  photo: {
    type: String,
    // required: true,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    select: false,
    // validate: validator.isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, returnScore: false }),
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      //This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
    },
    message: 'Passwords are not the same!',
    // validate: validator.isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, returnScore: false }),
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() + 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp; //100< 200
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
