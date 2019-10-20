import { Component } from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference} from "@angular/fire/storage";
import { AngularFireUploadTask } from "@angular/fire/storage";
import {finalize, map, tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {async} from "rxjs/internal/scheduler/async";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  uploadState: Observable<string>;
  img: any;
  snapshot:Observable<any>;
  downloadurl:string;

  constructor(private afStorage: AngularFireStorage) {
  this.img = ''
  }

  upload(event) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
  this.snapshot = this.task.snapshotChanges().pipe(
    tap(console.log),
    finalize( async() => {
       this.downloadurl = await this.ref .getDownloadURL().toPromise();
    })
  );

  }
  delete(){

  }
}
