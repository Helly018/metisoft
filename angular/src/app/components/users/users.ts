import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { ApiService, RecordItem } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  @ViewChild('nameInput') nameInputRef?: ElementRef<HTMLInputElement>;

  protected readonly showName = signal(this.getStoredConfig('showName', true));
  protected readonly showEmail = signal(this.getStoredConfig('showEmail', true));
  protected readonly showFieldsDropdown = signal(false);
  protected readonly tableColspan = computed(() => 2 + (this.showName() ? 1 : 0) + (this.showEmail() ? 1 : 0));

  protected readonly records = signal<RecordItem[]>([]);
  protected readonly filteredRecords = signal<RecordItem[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly searchTerms = signal('');

  protected readonly recordForm = this.fb.nonNullable.group({
    id: [null as number | null],
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  protected readonly isEditing = signal(false);
  protected readonly showModal = signal(false);
  protected readonly toastMessage = signal<string | null>(null);
  protected readonly toastType = signal<'success' | 'error'>('success');
  protected readonly recordToDelete = signal<RecordItem | null>(null);

  private getStoredConfig(key: string, defaultValue: boolean): boolean {
    const val = localStorage.getItem(key);
    return val === null ? defaultValue : val === 'true';
  }

  protected toggleColumn(col: 'name' | 'email'): void {
    if (col === 'name') {
      const newVal = !this.showName();
      this.showName.set(newVal);
      localStorage.setItem('showName', String(newVal));
    } else {
      const newVal = !this.showEmail();
      this.showEmail.set(newVal);
      localStorage.setItem('showEmail', String(newVal));
    }
  }

  ngOnInit(): void {
    this.loadRecords();
  }

  ngAfterViewInit(): void {
  }

  loadRecords(): void {
    this.isLoading.set(true);
    this.apiService.getRecords().subscribe({
      next: (data) => {
        this.records.set(data);
        this.applyFilter();
        this.isLoading.set(false);
      },
      error: () => {
        this.showToast('Failed to load records', 'error');
        this.isLoading.set(false);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerms().toLowerCase().trim();
    if (!term) {
      this.filteredRecords.set(this.records());
      return;
    }
    const filtered = this.records().filter(
      r => r.name.toLowerCase().includes(term) || r.email.toLowerCase().includes(term)
    );
    this.filteredRecords.set(filtered);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerms.set(value);
    this.applyFilter();
  }

  openAddModal(): void {
    this.isEditing.set(false);
    this.recordForm.reset({ id: null, name: '', email: '' });
    this.showModal.set(true);
    setTimeout(() => {
      this.nameInputRef?.nativeElement.focus();
    }, 50);
  }

  openEditModal(record: RecordItem): void {
    this.isEditing.set(true);
    this.recordForm.setValue({
      id: record.id,
      name: record.name,
      email: record.email
    });
    this.showModal.set(true);
    setTimeout(() => {
      this.nameInputRef?.nativeElement.focus();
    }, 50);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.recordForm.reset({ id: null, name: '', email: '' });
  }

  onSubmit(): void {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      return;
    }
    const formValue = this.recordForm.getRawValue();

    const exists = this.records().some(
      r => r.email.toLowerCase().trim() === formValue.email.toLowerCase().trim() && r.id !== formValue.id
    );
    if (exists) {
      this.showToast('Email already exists', 'error');
      this.isSaving.set(false);
      return;
    }

    this.isSaving.set(true);

    if (this.isEditing() && formValue.id !== null) {
      this.apiService.updateRecord(formValue.id, { name: formValue.name, email: formValue.email }).subscribe({
        next: () => {
          const updatedList = this.records().map(r => r.id === formValue.id ? { ...r, name: formValue.name, email: formValue.email } : r);
          this.records.set(updatedList);
          this.applyFilter();
          this.showToast('Record updated successfully', 'success');
          this.closeModal();
          this.isSaving.set(false);
        },
        error: () => {
          this.showToast('Failed to update record', 'error');
          this.isSaving.set(false);
        }
      });
    } else {
      this.apiService.addRecord({ name: formValue.name, email: formValue.email }).subscribe({
        next: () => {
          const generatedId = this.records().length > 0 ? Math.max(...this.records().map(r => r.id)) + 1 : 1;
          const newRecord: RecordItem = { id: generatedId, name: formValue.name, email: formValue.email };
          this.records.set([newRecord, ...this.records()]);
          this.applyFilter();
          this.showToast('Record created successfully', 'success');
          this.closeModal();
          this.isSaving.set(false);
        },
        error: () => {
          this.showToast('Failed to create record', 'error');
          this.isSaving.set(false);
        }
      });
    }
  }

  confirmDelete(record: RecordItem): void {
    this.recordToDelete.set(record);
  }

  cancelDelete(): void {
    this.recordToDelete.set(null);
  }

  deleteRecord(): void {
    const record = this.recordToDelete();
    if (!record) return;

    this.apiService.deleteRecord(record.id).subscribe({
      next: () => {
        this.records.set(this.records().filter(r => r.id !== record.id));
        this.applyFilter();
        this.showToast('Record deleted successfully', 'success');
        this.recordToDelete.set(null);
      },
      error: () => {
        this.showToast('Failed to delete record', 'error');
        this.recordToDelete.set(null);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private showToast(msg: string, type: 'success' | 'error'): void {
    this.toastMessage.set(msg);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 4000);
  }
}
