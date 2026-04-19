import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { AppSettings, Options } from '../app-settings';
import { I18nAlertService, RaceboardService, SpeechService } from '../services';

@Component({
    templateUrl: 'settings.page.html',
    standalone: false
})
export class SettingsPage implements OnDestroy, OnInit {

  options = new Options();
  raceboardUrl = '';

  private subscription: Subscription;

  constructor(private alert: I18nAlertService, private settings: AppSettings, private speech: SpeechService, private raceboard: RaceboardService) {}

  ngOnInit() {
    this.subscription = this.settings.getOptions().subscribe(options => {
      this.options = options;
    });
    this.raceboardUrl = this.raceboard.getUrl();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  reset() {
    this.alert.show({
      message: 'Reset all user settings to default values?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'OK',
        handler: () => { this.settings.clear(); }
      }]
    });
  }

  updateRaceboardUrl(event: any) {
    this.raceboardUrl = event.detail.value || '';
    this.raceboard.setUrl(this.raceboardUrl);
  }

  async updateLanguage() {
    if (this.options.language) {
      let voices = await this.speech.getVoices(this.options.language);
      if (!voices.find(v => v.identifier == this.options.voice)) {
        this.options.voice = "";
      }
    } else {
      this.options.voice = "";
    }
    return this.settings.setOptions(this.options);
  }
}
