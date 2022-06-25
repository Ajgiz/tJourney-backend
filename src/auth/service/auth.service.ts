import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({ email });
    if (!user) return null;
    const isPasswordMatch = await bcrypt.compare(pass, user.password);
    if (isPasswordMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
