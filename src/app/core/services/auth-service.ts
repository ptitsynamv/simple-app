import { Injectable } from '@angular/core';
import { User } from '@shared/interfaces/user.interfaces';
import { StorageService } from './storage-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _storageKey = 'userInfo';

  constructor(private _storageService: StorageService) {}

  public getUserInfo(): User | null {
    const userInfo = this._storageService.getItem(this._storageKey);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  public setUserInfo(user: User): void {
    this._storageService.setItem(this._storageKey, JSON.stringify(user));
  }

  public clearUserInfo(): void {
    this._storageService.removeItem(this._storageKey);
  }
}
