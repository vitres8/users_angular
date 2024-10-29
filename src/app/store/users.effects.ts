import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../services/user.service';
import {
  add,
  addSuccess,
  findAll,
  findAllPageable,
  load,
  remove,
  removeSuccess,
  setErrors,
  setPaginator,
  update,
  updateSuccess,
} from './users.actions';
import { catchError, EMPTY, exhaustMap, map, of, tap } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(load),
      exhaustMap((action) =>
        this.service.findAllPageable(action.page).pipe(
          map((pageable) => {
            const users = pageable.content as User[];
            const paginator = pageable;

            //   setPaginator({ paginator });
            return findAllPageable({ users, paginator });
          }),
          catchError((error) => of(error))
        )
      )
    )
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(add),
      exhaustMap((action) =>
        this.service.create(action.userNew).pipe(
          map((userNew) => addSuccess({ userNew })),
          catchError((error) =>
            error.status == 400
              ? of(setErrors({ userForm: action.userNew, errors: error.error }))
              : of(error)
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(update),
      exhaustMap((action) =>
        this.service.update(action.userUpdated).pipe(
          map((userUpdated) => updateSuccess({ userUpdated })),
          catchError((error) =>
            error.status == 400
              ? of(
                  setErrors({
                    userForm: action.userUpdated,
                    errors: error.error,
                  })
                )
              : of(error)
          )
        )
      )
    )
  );

  removeUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(remove),
      exhaustMap((action) =>
        this.service
          .remove(action.id)
          .pipe(map(() => removeSuccess({ id: action.id })))
      )
    )
  );
  addSuccessUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addSuccess),
        tap(() => {
          this.router.navigate(['/users']);
          Swal.fire({
            title: 'Creado!',
            text: 'Usuario Creado con Exito',
            icon: 'success',
          });
        })
      ),
    { dispatch: false }
  );

  updateSuccessUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateSuccess),
        tap(() => {
          this.router.navigate(['/users']);
          Swal.fire({
            title: 'Atualizado!',
            text: 'Usuario ha sido actualizado con Exito',
            icon: 'success',
          });
        })
      ),
    { dispatch: false }
  );

  removeSuccessUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeSuccess),
        tap(() => {
          this.router.navigate(['/users']);
          Swal.fire({
            title: 'Eliminado!',
            text: 'Tu Usuario ha sido Eliminado.',
            icon: 'success',
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private service: UserService,
    private router: Router
  ) {}
}
