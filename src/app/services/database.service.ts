import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../environments/environment';
import { ScoreModel } from '../models/score.model';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  constructor() {}

  async guardarScore(score: ScoreModel): Promise<void> {
    const { error } = await this.supabase.from('scores').insert([score]);

    if (error) {
      console.error('Error al guardar el score en Supabase:', error);
    } else {
      console.log('Score guardado correctamente en Supabase');
    }
  }

  async traerTopScorePorDificultad(dificultad: string): Promise<ScoreModel[]> {
    const { data, error } = await this.supabase
      .from('scores')
      .select('*')
      .eq('dificultad', dificultad)
      .order('score', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error al obtener top scores:', error);
      return [];
    }

    return data as ScoreModel[];
  }
  async traerTopTiempoPorDificultad(dificultad: string): Promise<ScoreModel[]> {
    const { data, error } = await this.supabase
      .from('scores')
      .select('*')
      .eq('dificultad', dificultad);

    if (error || !data) {
      console.error('Error al obtener tiempos:', error);
      return [];
    }

    // Convertimos el tiempo de texto ("mm:ss") a segundos para poder ordenar
    const dataOrdenada = data
      .map((item) => ({
        ...item,
        tiempoEnSegundos: this.convertirTiempoASegundos(item.tiempo),
      }))
      .sort((a, b) => a.tiempoEnSegundos - b.tiempoEnSegundos)
      .slice(0, 5); // top 5

    return dataOrdenada;
  }

  private convertirTiempoASegundos(tiempo: string): number {
    const [min, sec] = tiempo.split(':').map(Number);
    return min * 60 + sec;
  }
}
