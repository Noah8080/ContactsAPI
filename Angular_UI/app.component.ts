import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {environment} from '../../environment';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, AsyncPipe, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  http = inject(HttpClient);

contactsForm = new FormGroup({
  name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  email: new FormControl('', [Validators.email]),
  phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  favorite: new FormControl(false, { nonNullable: true }),
});

  contacts$: Observable<Contact[]> = this.getContacts();

  onFormSubmit() {
    console.log(this.contactsForm.value);
    if (!this.contactsForm.valid) {
      alert('Please fill out all fields');
      return;
    }

    // TODO: validate the form before submitting
    const addContactRequest = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phone: this.contactsForm.value.phone,
      favorite: this.contactsForm.value.favorite
    }

    this.http.post<Contact>(`${environment.apiUrl}/Contacts`, addContactRequest)    
    // need subscription to handle the request
    .subscribe({
      next: (response) => {
        console.log('Contact added successfully:', response);
        // Refresh the contacts list
        this.contacts$ = this.getContacts();
        // Reset the form after submission
        this.contactsForm.reset({
          name: '',
          email: null,
          phone: '',
          favorite: false
        });
      },
      error: (error) => {
        console.error('Error deleting contact:', error);
        alert('Failed to delete contact');
      }
    });
  }

  onDeleteContact(id: string) {
    this.http.delete(`https://localhost:7235/api/Contacts/${id}`)
    .subscribe({
      next: (value) => {
        alert('Contact deleted successfully');
        this.contacts$ = this.getContacts();
      },
      error: (error) => {
        console.error('Error deleting contact:', error);
        alert('Failed to delete contact');
      }
    })

  }
  

  private getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('https://localhost:7235/api/Contacts')

  }
}


