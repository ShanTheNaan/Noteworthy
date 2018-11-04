import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Course { name: string; }

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})

export class CoursesComponent {
  private courseCollection: AngularFirestoreCollection<Course>;
 
  course: Observable<Course[]>;

  constructor(private afs: AngularFirestore) {
    this.courseCollection = afs.collection<Course>('items');
    this.course = this.courseCollection.valueChanges();
  }

  addCourse(course: Course) {
    this.courseCollection.add(course);
  }
}
