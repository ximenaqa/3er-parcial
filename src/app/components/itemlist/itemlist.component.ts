import { Component, Input, OnInit } from '@angular/core';
import { Parabola } from 'src/app/interface/interface';
import { ContenidoComponent } from '../contenido/contenido.component';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.css']
})
export class ItemlistComponent implements OnInit{
 @Input() listparabola: any[] = [];
  constructor(private contenido: ContenidoComponent,
            private taskService: TaskService,
            ) {}

  updateParabola(parabola: Parabola) {
    this.contenido.isUpdate = true;
    this.contenido.updParabola = parabola;
    this.contenido.updateParabola();
  }

  ngOnInit() {
    setTimeout(async () => {
      for (const l of this.listparabola) {
        const firstFriend = await this.taskService.db.libro.get({id: Number(l.idcategoria)});
        l.catname = firstFriend.nombre;
      }
    }, 1000);
  }

  eliminar(id: any) {
    this.taskService.deleteRegisterParabola(id);
    this.contenido.closeModal('myModal');
    this.contenido.loadParabola();
  }

}
