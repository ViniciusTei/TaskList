import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { TaskService } from '../services/task.service';
import { TableModel } from '../models/table-model';
import { TaskModel } from '../models/task-model';
import { faPlus } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  plus = faPlus;
  //essas variaveis serao trocadas pelo retorno do banco de dados
  tables: TableModel[] = new Array<TableModel>();
  tasks: TaskModel[] = new Array<TaskModel>();
  
  novaTabela: string = "";
  novaTarefa: string = "";
  currentTable: string = "";
  
  constructor(private _firebase: TaskService) { }

  async ngOnInit() {
    await this._firebase.getTables()
      .subscribe(result => {
        this.tables = result.map(res => {
          return {
            id: res.payload.doc.id,
            name: res.payload.doc.data()['name'],
            tasks: res.payload.doc.data()['tasks']
          }
        })
      })
      
  }

  //metodos drop e dropTask sao para o drag'n'drop 
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      }   
    
  }

  dropTask(event: any) {
    console.log(event);

  }

  async onCriarTabela() {
    await this._firebase.createTable(this.novaTabela)
      .then(
        result => {
          console.log(result);
          this.novaTabela = "";
          alert('Tabela criada');
        }
      )
  }
  
  onKeyup(event: any, isTable: boolean) {
    if(isTable)
      this.novaTabela = event.target.value;
    else
      this.novaTarefa = event.target.value;
  }

  dropTable(table: TableModel) {
    console.log(table);
    this._firebase.deleteTable(table.id)
    //this.tables = this.tables.filter(x => x != table);
  }

  dropItem(item: string, tableId: string) {
    let table = this.tables.filter(table =>  table.id == tableId)[0];
    table.tasks = table.tasks.filter(x => x != item);

    this._firebase.deleteTask(table)
      .then(res =>  console.log('Task deleted!'))
    
  }

  onCriarTarefa() {
    let table = this.tables.filter(table =>  table.id == this.currentTable)[0];
    table.tasks.push(this.novaTarefa);
    this._firebase.createTask(table, table.id)
      .then(res => {
        this.novaTarefa = "";
        console.log('Tarefa adicionada')
      })
  }

  setTableId(tableId: string) {
    this.currentTable = tableId;
  }
  
}
