import { Component, Input, OnInit } from '@angular/core';
import { Libro, Parabola } from '../../interface/interface';
import { TaskService } from 'src/app/services/task.service';
@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['../../app.component.css']
})

export class ContenidoComponent implements OnInit {
  libro: Libro = {};
  parabola: Parabola = {};
  listParabola: any = [];
  listCategoria: any = [];
  updParabola: Parabola = {};
  isUpdate = false;
  isUpdateL = false;
  categoria = [
    {id: 0, name: 'Antiguo testamento'},
    {id: 1, name: 'Nuevo testamento'}
  ];

constructor(
  private taskService: TaskService,
  ) {

}

  ngOnInit() {
    this.loadParabola();
  }

  async loadParabola() {
    this.listParabola = await this.taskService.loadParabola();
    for (const l of this.listParabola) {
      const firstFriend = await this.taskService.db.libro.get({id: Number(l.idcategoria)});
      l.catname = firstFriend.nombre;
    }
  }

  async loadLibro() {
    setTimeout(() => {
      this.libro.nombre = '';
    }, 500);
    this.listCategoria = await this.taskService.loadLibro();
      for (const l of this.listCategoria) {
        l.catname = this.categoria.find(f => f.id == l.categoria)?.name;
      }
  }

  delete(id: number) {
    this.taskService.deleteRegisterParabola(id);
  }

  async openModal(idModal: string) {
    this.libro.nombre = '';
    const modal = document.getElementById(idModal);
    if (modal != null) {
      modal.style.display = 'block';
    }

    if (idModal == 'modalLibro') {
      this.generaridLibro()
      this.loadLibro();
    }

    if (idModal == 'myModal') {
      if (!this.isUpdate) {
        this.parabola = {};
        this.generarIdParabola();
      }
      this.listCategoria = await this.taskService.loadLibro();
    }
  }

  async generaridLibro() {
    const lista: any = await this.taskService.libro?.toArray();
    if (lista !== null || lista !== undefined) {
      const max = lista.map((e: any) => e.id);
      this.libro.id = Math.max(...max) + 1;
    } else {
      this.libro.id = 1;
    }
  }

  async generarIdParabola() {
    const lista: any = await this.taskService.parabola?.toArray();
    if (lista !== null || lista !== undefined) {
      const max = lista.map((e: any) => e.id);
      this.parabola.id = Math.max(...max) + 1;
    } else {
      this.parabola.id = 1;
    }
  }

  updateParabola() {
    if (this.isUpdate) {
      this.parabola = {
        id: this.updParabola.id,
        nombre: this.updParabola.nombre,
        texto: this.updParabola.texto,
        descripcion: this.updParabola.descripcion,
        imagen: this.updParabola.imagen,
        idcategoria: this.updParabola.idcategoria,
      }
    }
    this.openModal('myModal');
  }

  closeModal(idModal: string) {
    const modal = document.getElementById(idModal);
    if (modal != null) {
      modal.style.display = 'none';
    }
  }

  async guardarLibro() {
    if (this.libro.nombre == '') {
      alert('Ingrese nombre del libro');
      return;
    } else if(this.libro.categoria == null) {
      alert('Seleccione una categoria');
      return;
    } 
    if (this.isUpdateL) {
      this.taskService.updateRegisterLibro(this.libro);
      this.isUpdateL = false;
    } else {
      this.taskService.guardarIndexedDb(this.libro);
    }
    
    this.generaridLibro();
    this.loadLibro();

  }

  guardarParabola() {
    if (this.parabola.nombre == '') {
      alert('Ingrese nombre del parabola');
      return;
    } else if(this.parabola.idcategoria == null) {
      alert('Seleccione libro');
      return;
    } 
    this.taskService.guardarIndexedParabolaDb(this.parabola);
    this.showListParabole();
  }

  actualizarParabola() {
    this.taskService.updateRegister(this.parabola);
    this.showListParabole();
  }
  
  showListParabole() {
    this.closeModal('myModal');
    this.loadParabola();
  }

  eliminarTodo() {
    this.taskService.deleteAllParabola();
  }

  eliminarLibro(id: any) {
    this.taskService.deleteRegisterLibro(id);
    this.loadLibro();
  }

  editarLibro(item: Libro) {
    this.isUpdateL = true;
    this.libro = {
      id: item.id,
      nombre: item.nombre,
      categoria: item.categoria
    }
  }

}