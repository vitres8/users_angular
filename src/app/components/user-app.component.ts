import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
  styleUrl: './user-app.component.css'

})
export class UserAppComponent implements OnInit {

  

  users: User[] = [];


  constructor(
    private router: Router,
    private service: UserService,
    private sharingData: SharingDataService) {


  }

  ngOnInit(): void {
    this.service.findAll().subscribe( users => this.users = users);
    this.addUser();
    this.removeUser();
  }

  addUser() {
    this.sharingData.newUserEventEmitter.subscribe(user => {
      
      if(user.id > 0){
        this.users = this.users.map( u => (u.id == user.id) ? {... user}: u);
      } else {
        this.users = [... this.users, {... user, id: new Date().getTime()}];
      }
      this.router.navigate(['/users'], {state: {users: this.users}});
  
      Swal.fire({
        title: "Guardado!",
        text: "Usuario Guardado con Exito",
        icon: "success"
      });
    })
  }

  removeUser(): void {
    this.sharingData.idUserEventEmitter.subscribe(id => {

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
          this.router.navigate(['/user/create'], {skipLocationChange:true}).then(() => {
            this.router.navigate(['/users'], {state: {users: this.users}});
          })
          
          Swal.fire({
            title: "Eliminado!",
            text: "Tu Usuario ha sido Eliminado.",
            icon: "success"
          });
        }
      });
    })
  }
}
