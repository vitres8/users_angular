import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
  styleUrl: './user-app.component.css',
})
export class UserAppComponent implements OnInit {
  users: User[] = [];
  paginator: any = {};

  constructor(
    private router: Router,
    private service: UserService,
    private sharingData: SharingDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.service.findAll().subscribe((users) => (this.users = users));

    // this.route.paramMap.subscribe((params) => {
    //   const page = +(params.get('page') || 0);
    //   this.service
    //     .findAllPageable(page)
    //     .subscribe((pageable) => (this.users = pageable.content as User[]));
    // });
    this.addUser();
    this.removeUser();
    this.findUserById();
    this.pageUserEvent();
  }

  pageUserEvent() {
    this.sharingData.pageUserEventEmitter.subscribe((pageable) => {
      this.users = pageable.users;
      this.paginator = pageable.paginator;
    });
  }

  findUserById() {
    this.sharingData.findUserByIdEventEmitter.subscribe((id) => {
      const user = this.users.find((user) => user.id == id);

      this.sharingData.selectUserEventEmitter.emit(user);
    });
  }

  addUser() {
    this.sharingData.newUserEventEmitter.subscribe((user) => {
      if (user.id > 0) {
        this.service.update(user).subscribe({
          next: (userUpdated) => {
            this.users = this.users.map((u) =>
              u.id == userUpdated.id ? { ...userUpdated } : u
            );
            this.router.navigate(['/users'], {
              state: { users: this.users, paginator: this.paginator },
            });
            Swal.fire({
              title: 'Atualizado!',
              text: 'Usuario ha sido actualizado con Exito',
              icon: 'success',
            });
          },
          error: (err) => {
            // console.log(err.error);
            if (err.status == 400) {
              this.sharingData.errorsUserFormEventEmitter.emit(err.error);
            }
          },
        });
      } else {
        this.service.create(user).subscribe({
          next: (userNew) => {
            console.log(userNew);
            this.users = [...this.users, { ...userNew }];
            this.router.navigate(['/users'], {
              state: { users: this.users, paginator: this.paginator },
            });
            Swal.fire({
              title: 'Creado!',
              text: 'Usuario Creado con Exito',
              icon: 'success',
            });
          },
          error: (err) => {
            // console.log(err.error);
            // console.log(err.status);
            if (err.status == 400) {
              this.sharingData.errorsUserFormEventEmitter.emit(err.error);
            }
          },
        });
      }
      // this.router.navigate(['/users']);
    });
  }

  removeUser(): void {
    this.sharingData.idUserEventEmitter.subscribe((id) => {
      Swal.fire({
        title: 'Estas Seguro de Eliminar el Usuario?',
        text: 'No podras recuperarlo!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si Eliminalo!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.remove(id).subscribe(() => {
            this.users = this.users.filter((user) => user.id != id);
            this.router
              .navigate(['/users/create'], { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/users'], {
                  state: { users: this.users, paginator: this.paginator },
                });
              });
          });

          Swal.fire({
            title: 'Eliminado!',
            text: 'Tu Usuario ha sido Eliminado.',
            icon: 'success',
          });
        }
      });
    });
  }
}
