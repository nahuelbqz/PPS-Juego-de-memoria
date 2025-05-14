import { NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonImg,
  IonButtons,
} from '@ionic/angular/standalone';
import { ScoreModel } from 'src/app/models/score.model';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import Swal from 'sweetalert2';
interface Carta {
  valor: string;
  destapada: boolean;
  encontrada: boolean;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonImg, IonContent, IonTitle, NgIf, NgFor, NgForOf, IonButton],
})
export class HomePage {
  authService = inject(AuthService);
  router = inject(Router);
  databaseService = inject(DatabaseService);

  usuarioActual: any = null;
  dificultad: string = '';
  cartasArray: any = [];
  cartas: any = [];
  seconds: number = 0;
  intervalId: any;
  aciertos: number = 0;
  cantidadPares: number = 0;
  tiempoJugador: any;

  animales = [
    {
      id: 1,
      urlImagen: '../../../assets/animales/cat.png',
    },
    {
      id: 2,
      urlImagen: '../../../assets/animales/chicken.png',
    },
    {
      id: 3,
      urlImagen: '../../../assets/animales/dog.png',
    },
    {
      id: 4,
      urlImagen: '../../../assets/animales/cat.png',
    },
    {
      id: 5,
      urlImagen: '../../../assets/animales/chicken.png',
    },
    {
      id: 6,
      urlImagen: '../../../assets/animales/dog.png',
    },
  ];

  herramientas = [
    {
      id: 1,
      urlImagen: '../../../assets/herramientas/destornillador.png',
    },
    {
      id: 2,
      urlImagen: '../../../assets/herramientas/martillo.png',
    },
    {
      id: 3,
      urlImagen: '../../../assets/herramientas/hacha.png',
    },
    {
      id: 4,
      urlImagen: '../../../assets/herramientas/serrucho.png',
    },
    {
      id: 5,
      urlImagen: '../../../assets/herramientas/llave.png',
    },
    {
      id: 6,
      urlImagen: '../../../assets/herramientas/destornillador.png',
    },
    {
      id: 7,
      urlImagen: '../../../assets/herramientas/martillo.png',
    },
    {
      id: 8,
      urlImagen: '../../../assets/herramientas/hacha.png',
    },
    {
      id: 9,
      urlImagen: '../../../assets/herramientas/serrucho.png',
    },
    {
      id: 10,
      urlImagen: '../../../assets/herramientas/llave.png',
    },
  ];

  frutas = [
    {
      id: 1,
      urlImagen: '../../../assets/frutas/anana.png',
    },
    {
      id: 2,
      urlImagen: '../../../assets/frutas/banana.png',
    },
    {
      id: 3,
      urlImagen: '../../../assets/frutas/frutilla.png',
    },
    {
      id: 4,
      urlImagen: '../../../assets/frutas/manzana.png',
    },
    {
      id: 5,
      urlImagen: '../../../assets/frutas/naranja.png',
    },
    {
      id: 6,
      urlImagen: '../../../assets/frutas/pera.png',
    },
    {
      id: 7,
      urlImagen: '../../../assets/frutas/sandia.png',
    },
    {
      id: 8,
      urlImagen: '../../../assets/frutas/uvas.png',
    },
    {
      id: 9,
      urlImagen: '../../../assets/frutas/anana.png',
    },
    {
      id: 10,
      urlImagen: '../../../assets/frutas/banana.png',
    },
    {
      id: 11,
      urlImagen: '../../../assets/frutas/frutilla.png',
    },
    {
      id: 12,
      urlImagen: '../../../assets/frutas/manzana.png',
    },
    {
      id: 13,
      urlImagen: '../../../assets/frutas/naranja.png',
    },
    {
      id: 14,
      urlImagen: '../../../assets/frutas/pera.png',
    },
    {
      id: 15,
      urlImagen: '../../../assets/frutas/sandia.png',
    },
    {
      id: 16,
      urlImagen: '../../../assets/frutas/uvas.png',
    },
  ];

  constructor() {}

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();
    this.usuarioActual = user?.email ?? null;
  }
  jugar(id: number) {
    const element = document.getElementById(id.toString());

    element!.classList.toggle('flipped');

    let carta1 = this.cartas.find((a: { id: number }) => a.id == id);

    if (this.cartasArray.length == 0) {
      this.cartasArray.push(carta1);
    } else {
      const esta = this.cartasArray.find(
        (a: { urlImagen: string | undefined }) =>
          a.urlImagen == carta1?.urlImagen
      );
      const repetida = this.cartasArray.find((a: { id: number }) => a.id == id);

      if (repetida) {
        this.cartasArray = [];
        return;
      }

      const idCarta1 = this.cartasArray[0].id;
      const element1 = document.getElementById(idCarta1.toString());

      const element2 = document.getElementById(id.toString());
      if (!esta) {
        setTimeout(() => {
          element1!.classList.toggle('flipped');
          element2!.classList.toggle('flipped');
        }, 1000);
      } else {
        element1!.parentNode?.removeAllListeners!();
        element2!.parentNode?.removeAllListeners!();
        this.aciertos++;
        if (this.aciertos == this.cantidadPares) {
          this.tiempoJugador = this.formatTime();
          clearInterval(this.intervalId);
          setTimeout(() => {
            this.win();
          }, 1000);
        }
      }

      this.cartasArray = [];
    }
  }

  elegirNivel(nivel: number) {
    switch (nivel) {
      case 0:
        this.aciertos = 0;
        this.cantidadPares = 0;
        this.stopTimer();
        this.dificultad = '';
        this.cartas = [];
        break;

      case 1:
        this.dificultad = 'Facil';
        this.cantidadPares = 3;
        this.cartas = this.animales;
        this.cartas.sort(() => Math.random() - 0.5);
        this.startTimer();
        break;

      case 2:
        this.dificultad = 'Medio';
        this.cantidadPares = 5;
        this.cartas = this.herramientas;
        this.cartas.sort(() => Math.random() - 0.5);
        this.startTimer();
        break;

      case 3:
        this.dificultad = 'Dificil';
        this.cantidadPares = 8;
        this.cartas = this.frutas;
        this.cartas.sort(() => Math.random() - 0.5);
        this.startTimer();
        break;
    }
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  updateTimer() {
    this.seconds++;
  }

  formatTime() {
    const minutes = Math.floor(this.seconds / 60);
    const remainingSeconds = this.seconds % 60;
    return `${this.padTime(minutes)}:${this.padTime(remainingSeconds)}`;
  }

  padTime(time: number) {
    return time < 10 ? `0${time}` : time;
  }

  stopTimer() {
    this.seconds = 0;
    clearInterval(this.intervalId);
  }

  win() {
    Swal.fire({
      title: 'Ganaste!',
      text: `Tu tiempo fue de: ${this.tiempoJugador}`,
      confirmButtonText: 'Elegir otra dificultad',
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.guardarDatos();
        this.elegirNivel(0);
        this.stopTimer();
      } else {
        this.stopTimer();
        this.elegirNivel(0);
        this.elegirNivel(1);
      }
    });
  }

  async guardarDatos() {
    const nuevoScore: ScoreModel = {
      user: this.usuarioActual,
      score: this.seconds.toString(),
      tiempo: this.tiempoJugador,
      dificultad: this.dificultad,
      date: new Date(),
    };

    await this.databaseService.guardarScore(nuevoScore);
  }

  goTo(to: string) {
    this.router.navigateByUrl(to);
  }

  formatDate(tdate: any): string {
    let date = tdate.toDate();
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  cerrarSesion() {
    if (this.authService.currentUser()) {
      console.log(this.authService.currentUser()?.username);
      this.authService.logout();
      this.router.navigateByUrl('/login');
    }
  }

  volverAlMenu() {
    this.elegirNivel(0);
    this.stopTimer();
  }
}
