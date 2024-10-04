import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  constructor() {}

  async login() {
    return 'Login';
  }

  async register() {
    return 'Register';
  }

  async forgotPassword() {
    return 'Forgot Password';
  }

  async resetPassword() {
    return 'Reset Password';
  }
}
