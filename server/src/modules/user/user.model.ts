import type { Model } from 'mongoose';
import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { IUser } from './user.types';
import { Provider, Role } from './user.types';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    avatar: { type: String },
    address: [
      {
        country: { type: String, required: [true, 'Country is required'] },
        city: { type: String, required: [true, 'City is required'] },
        state: { type: String },
        street: { type: String, required: [true, 'Street is required'] },
        zipCode: { type: String },
        isDefault: { type: Boolean, default: false },
      },
    ],
    phone: { type: String },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    provider: {
      type: String,
      enum: Object.values(Provider),
      default: Provider.LOCAL,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.set('toJSON', {
  transform: (_, ret) => {
    const { password: _password, ...rest } = ret;
    return rest;
  },
});

userSchema.pre<IUser>('save', async function () {
  if (!this.password || !this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const userPassword = this.password as string;
  return bcrypt.compare(candidatePassword, userPassword);
};

export const User: Model<IUser> = model<IUser>('User', userSchema);
