import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const STORAGE_KEY = 'raceboard_url';

@Injectable({ providedIn: 'root' })
export class RaceboardService {

  getUrl(): string {
    return localStorage.getItem(STORAGE_KEY) || '';
  }

  setUrl(url: string) {
    if (url) {
      localStorage.setItem(STORAGE_KEY, url);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  constructor(private http: HttpClient) {}

  sendBestLap(controllerId: number, laptimeRaw: number) {
    const url = this.getUrl();
    if (!url) return;

    const body = {
      event_type: 'ui.lap_update',
      event_data: {
        controller_id: String(controllerId + 1),
        laptime_raw: laptimeRaw,
        lap_pb: true
      }
    };

    this.http.post(url, body).subscribe({
      error: err => console.error('RaceBoard POST failed:', err)
    });
  }
}
