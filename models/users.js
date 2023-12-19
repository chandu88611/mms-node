import mongoose from 'mongoose';

const customUserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password:{
    type: String,
    unique: true,
    required: true,
  },
  first_name: {
    type: String,
    max_length: 30,
    default: '',
  },
  last_name: {
    type: String,
    max_length: 30,
    default: '',
  },
  roles: {
    type: [String],
    enum: ['user', 'admin'],
    default: ['user'],
    
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_staff: {
    type: Boolean,
    default: false,
  },
});

const CustomUser = mongoose.model('CustomUser', customUserSchema);

export default CustomUser;
