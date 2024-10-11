import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user-form/user-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [UserComponent, UserFormComponent],
  templateUrl: './user-app.component.html',
  styleUrl: './user-app.component.css'

})
export class UserAppComponent implements OnInit {

  title: string = 'Listado de usuarios!';

  users: User[] = [];

  userSelected: User;

  open: boolean = false;

  constructor(private service: UserService) {
    this.userSelected = new User();
  }

  ngOnInit(): void {
    this.service.findAll().subscribe( users => this.users = users);
  }

  addUser(user: User) {
    if(user.id > 0){
      this.users = this.users.map( u => (u.id == user.id) ? {... user}: u);
    } else {
      this.users = [... this.users, {... user, id: new Date().getTime()}];
    }

    Swal.fire({
      title: "Guardado!",
      text: "Usuario Guardado con Exito",
      icon: "success"
    });

    this.userSelected = new User();
    this.setOpen();
  }

  removeUser(id: number): void {

    Swal.fire({
      title: "Estas Seguro de Eliminar el Usuario?",
      text: "No podras recuperarlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si Eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.users = this.users.filter( user => user.id != id);
        Swal.fire({
          title: "Eliminado!",
          text: "Tu Usuario ha sido Eliminado.",
          icon: "success"
        });
      }
    });

    
  }

  setSelectedUser(userRow: User): void {
    this.userSelected = {... userRow};
    this.open = true;
  }

  setOpen() {
    this.open = !this.open;
  }

}
