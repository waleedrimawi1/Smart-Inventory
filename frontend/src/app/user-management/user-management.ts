import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from '../dashboard/dashboard';
import { UserApiService, UserData } from '../services/user-api.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule,
    DashboardComponent
  ],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagementComponent implements OnInit {
  users: UserData[] = [];
  filteredUsers: UserData[] = [];
  dataSource = new UserDataSource(this.filteredUsers);
  displayedColumns: string[] = ['id', 'fullName', 'email', 'phone', 'role', 'actions'];
  searchTerm: string = '';
  loading = false;

  constructor(
    private userApiService: UserApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userApiService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.dataSource.setData(this.filteredUsers);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = this.users;
    } else {
      const filterValue = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.fullName.toLowerCase().includes(filterValue) ||
        user.email.toLowerCase().includes(filterValue) ||
        user.phone.toLowerCase().includes(filterValue) ||
        user.role.name.toLowerCase().includes(filterValue)
      );
    }
    this.dataSource.setData(this.filteredUsers);
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createUser(result);
      }
    });
  }

  createUser(userData: any): void {
    this.userApiService.createUser(userData).subscribe({
      next: (response) => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error creating user:', error);
      }
    });
  }

  editUser(user: any): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { mode: 'edit', user: user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser(user.id, result);
      }
    });
  }

  updateUser(userId: number, userData: any): void {
    this.userApiService.updateUser(userId, userData).subscribe({
      next: (response) => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }

  confirmDelete(user: UserData): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete user "${user.fullName}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(user.id!);
      }
    });
  }

  deleteUser(userId: number): void {
    this.userApiService.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      }
    });
  }
}

class UserDataSource extends DataSource<UserData> {
  private dataSubject = new ReplaySubject<UserData[]>(1);

  constructor(initialData: UserData[]) {
    super();
    this.dataSubject.next(initialData);
  }

  connect(): Observable<UserData[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(): void {
    this.dataSubject.complete();
  }

  setData(data: UserData[]): void {
    this.dataSubject.next(data);
  }
}