import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { resolve } from 'dns';
import { TableModel } from '../models/table-model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  constructor(private db: AngularFirestore) { }

  createTable(nome: string) {
    return this.db.collection('tables').add({
      name: nome,
      tasks: []
    });
  }

  getTables() {
    return this.db.collection('tables').snapshotChanges();
  }

  deleteTable(tableId: string) {
    return this.db.doc('tables/' + tableId).delete()
  }

  createTask(table: TableModel, tableId: string) {
    return this.db.doc('tables/' + tableId).update(table)
  }

  deleteTask(table: TableModel) {
    return this.db.doc('tables/' + table.id).update(table)
  }
}
