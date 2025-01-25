import { Controller, Post, Get, Inject, Injectable } from '@nestjs/common';

// services
import { AuthService } from './service/auth.service';
import { AccountService } from '../account/service/account.service';

// providers
import { TokenProvider } from './providers/token.provider';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject() private readonly tokenProvider: TokenProvider,
    @Inject() private readonly authService: AuthService,
    @Inject() private readonly accountService: AccountService,
  ) {}
}
