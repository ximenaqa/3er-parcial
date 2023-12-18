import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Libro, Parabola } from '../interface/interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
db: any | undefined;
libro: Dexie.Table<Libro, any> | undefined;
parabola: Dexie.Table<Parabola, any> | undefined;
  constructor(
  ) {
    this.iniciarIndexedDb();
  }

  private iniciarIndexedDb() {
    this.db = new Dexie('dbexamen');
    this.db.version(1).stores({
      libro: '++id,nombre,categoria',
      parabola: '++id,nombre,texto,descripcion,imagen,idcategoria'
    });
    this.libro = this.db.table('libro');
    this.parabola = this.db.table('parabola');
  }


  async guardarIndexedDb(libro: Libro | undefined) {
    console.log('libro ', libro);
    try {
      if (libro) {
        await this.libro?.add({id: libro.id, nombre: libro.nombre, categoria: libro.categoria});
      } else { console.log('object'); }
    } catch (error) {
      console.log('error al guardar', error);
      
    }
  }

  async guardarIndexedParabolaDb(parabola: Parabola) {
    try {
      if (parabola) {await this.parabola?.add({ id: Number(parabola.id), nombre: parabola.nombre, texto: parabola.texto,
        descripcion: parabola.descripcion, imagen: parabola.imagen, idcategoria: parabola.idcategoria});
      } else { console.log('object'); }
    } catch (error) {
      console.log('error al guardar', error);
      
    }
  }

  async loadParabola() {
    return await this.parabola?.toArray();
 }

 async loadLibro() {
  return await this.libro?.toArray();
}

  async updateRegister(parabola: Parabola) {
    await this.db.parabola.update(parabola.id, parabola);
  }

  async updateRegisterLibro(libro: Libro) {
    await this.db.libro.update(libro.id, libro);
  }

  async deleteRegisterParabola(id: number) {
    await this.db.parabola.delete(id);
  }

  async deleteRegisterLibro(id: number) {
    await this.db.libro.delete(id);
  }

  deleteAllLibro() {
    this.libro?.clear();
  }

  deleteAllParabola() {
    this.parabola?.clear();
  }
}


