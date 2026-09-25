import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../models/prisma';
import { env } from '../config/env';
import { JwtPayload, UserRole } from '../types';

export class AuthService {
  /**
   * Request OTP for rider login (mocked for demo as per config/DEMO_OTP)
   */
  static async requestRiderOtp(phone: string): Promise<{ otpSent: boolean }> {
    // Find or soft-create user for phone if needed
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          role: 'rider',
        },
      });
      await prisma.rider.create({
        data: {
          user_id: user.id,
          name: `Rider ${phone.slice(-4)}`,
          tier: 'bronze',
          grs_score: 0,
        },
      });
    }
    return { otpSent: true };
  }

  /**
   * Verify Rider OTP and issue JWT
   */
  static async verifyRiderOtp(phone: string, otp: string) {
    if (otp !== env.DEMO_OTP && otp !== '1234') {
      throw new Error('INVALID_OTP');
    }

    let user = await prisma.user.findUnique({
      where: { phone },
      include: { rider: { include: { vehicles: true } } },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          role: 'rider',
        },
        include: { rider: { include: { vehicles: true } } },
      });
    }

    let rider = user.rider;
    if (!rider) {
      rider = await prisma.rider.create({
        data: {
          user_id: user.id,
          name: `Rider ${phone.slice(-4)}`,
          tier: 'bronze',
          grs_score: 0,
        },
        include: { vehicles: true },
      });
    }

    const payload: JwtPayload = { userId: user.id, role: 'rider' };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_RIDER_EXPIRY as jwt.SignOptions['expiresIn'] });

    return {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        role: user.role,
        rider: rider ? {
          id: rider.id,
          name: rider.name,
          tier: rider.tier,
          grsScore: rider.grs_score,
          vehicles: rider.vehicles,
        } : null,
      },
    };
  }

  /**
   * Login platform admin or corporate buyer using email & password
   */
  static async loginWithEmail(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        corporate_buyer: true,
        fleet: true,
      },
    });

    if (!user || !user.password_hash) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const payload: JwtPayload = { userId: user.id, role: user.role as UserRole };
    const expiry = user.role === 'platform_admin' ? env.JWT_ADMIN_EXPIRY : env.JWT_BUYER_EXPIRY;
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: expiry as jwt.SignOptions['expiresIn'] });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyName: user.corporate_buyer?.company_name || user.fleet?.name || null,
        corporateBuyer: user.corporate_buyer,
      },
    };
  }

  /**
   * Register a new user (platform admin or corporate buyer)
   */
  static async registerWithEmail(data: {
    email: string;
    password: string;
    role: UserRole;
    companyName?: string;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new Error('USER_EXISTS');
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password_hash,
        role: data.role,
      },
    });

    let companyName = data.companyName || '';

    if (data.role === 'corporate_buyer') {
      const buyer = await prisma.corporateBuyer.create({
        data: {
          user_id: user.id,
          company_name: companyName || 'Corporate Buyer Org',
          billing_contact: data.email,
        },
      });
      companyName = buyer.company_name;
    } else if (data.role === 'platform_admin') {
      const fleet = await prisma.fleet.create({
        data: {
          platform_admin_user_id: user.id,
          name: companyName || 'Fleet Admin Ops',
          saas_rate_per_rider: 150,
        },
      });
      companyName = fleet.name;
    }

    const payload: JwtPayload = { userId: user.id, role: user.role };
    const expiry = user.role === 'platform_admin' ? env.JWT_ADMIN_EXPIRY : env.JWT_BUYER_EXPIRY;
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: expiry as jwt.SignOptions['expiresIn'] });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyName,
      },
    };
  }

  /**
   * Get current authenticated user details
   */
  static async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        rider: { include: { vehicles: true } },
        corporate_buyer: true,
        fleet: true,
      },
    });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      rider: user.rider
        ? {
            id: user.rider.id,
            name: user.rider.name,
            tier: user.rider.tier,
            grsScore: user.rider.grs_score,
            vehicles: user.rider.vehicles,
          }
        : null,
      corporateBuyer: user.corporate_buyer,
      fleet: user.fleet,
    };
  }
}
