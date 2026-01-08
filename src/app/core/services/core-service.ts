import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  public getUserName(): Observable<string> {
    return of('Maria').pipe(delay(1000));
  }
}
