import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';
import { ScoreModel } from 'src/app/models/score.model';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
  standalone: true,
  imports: [
    IonList,
    IonItem,
    IonLabel,
    IonContent,
    IonTitle,
    CommonModule,
    FormsModule,
  ],
})
export class LeaderboardPage implements OnInit {
  private authService: AuthService = inject(AuthService);
  private storeService: DatabaseService = inject(DatabaseService);
  private router: Router = inject(Router);

  scoresFacil: ScoreModel[] = [];
  scoresMedio: ScoreModel[] = [];
  scoresDificil: ScoreModel[] = [];

  constructor() {}

  goTo(to: string) {
    this.router.navigateByUrl(to);
  }

  ngOnInit() {
    this.storeService.traerTopTiempoPorDificultad('Facil').then((data) => {
      this.scoresFacil = data;
    });
    this.storeService.traerTopTiempoPorDificultad('Medio').then((data) => {
      this.scoresMedio = data;
    });
    this.storeService.traerTopTiempoPorDificultad('Dificil').then((data) => {
      this.scoresDificil = data;
    });
  }
}
