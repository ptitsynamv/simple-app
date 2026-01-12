import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { User } from '../../shared/interfaces/user.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  public getUserInfo(): Observable<User> {
    return of({
      name: 'Maria',
      picture: 'https://cdn.pixabay.com/photo/2022/03/27/11/23/cat-7094808_1280.jpg',
      email: 'maria@example.com',
    }).pipe(delay(1000));
  }
}
