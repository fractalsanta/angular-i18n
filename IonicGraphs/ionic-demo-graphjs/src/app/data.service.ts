import { Injectable } from '@angular/core';
import { ProvincialDamLevel } from './data.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const URL = 'http://localhost:5000/dam-levels';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  getDamLevels(): Observable<ProvincialDamLevel[]> {
    return this.http.get<ProvincialDamLevel[]>(URL);
  }
}
