const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;
mongoose.promise = Promise;

// Define userSchema
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: "Username is required",
    validate: {
      validator: function (v) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  password: {
    type: String,
    // unique: true,
    trim: true,
    required: "Password is required",
    // TODO validation
  },
  goal: {
    type: Number,
  },
  revenue: {
    type: Number,
    default: 0,
  },
  items: [
    {
      name: {
        type: String,
        trim: true,
        required: "Enter a name for the item",
      },
      description: {
        type: String,
        trim: true,
      },
      price: {
        type: Number,
        required: "Enter a price for the item",
        // validation: $XX.XX 2 decimal places
      },
      // picture ?
    },
  ],
});

// Define schema methods
userSchema.methods = {
  checkPassword: function (inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  },
  hashPassword: (plainTextPassword) => {
    return bcrypt.hashSync(plainTextPassword, 10);
  },
};

// Define hooks for pre-saving
userSchema.pre("save", function (next) {
  if (!this.password) {
    console.log("NO PASSWORD PROVIDED");
    next();
  } else {
    this.password = this.hashPassword(this.password);
    next();
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
