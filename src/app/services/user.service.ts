import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [ 
    {
      id:1,
      name: 'Andres',
      lastname: 'Guzman',
      email: 'andres@gmail.com',
      username: 'andreser',
      password: '12345'
    },
    {
      id:2,
      name: 'Josefa',
      lastname: 'Doe',
      email: 'pepa.doe@gmail.com',
      username: 'pepatita',
      password: '4r3f34'
    },
    {
      id:3,
      name: 'Raul',
      lastname: 'Medina',
      email: 'raulmedina@gmail.com',
      username: 'raulines',
      password: '33d3dq'
    },
  ];

  constructor() { }

  findAll(): Observable<User[]>{
    return of(this.users);
  }
}
