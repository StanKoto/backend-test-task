'use strict';
import { showErrors } from '../modules/showErrors.js';

const user = document.querySelector('.display-user');
const navLinks = document.querySelectorAll('.btn');
const error = document.querySelector('.error');

fetch(document.location.origin + '/api/v1/users/1')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      user.innerHTML = `
        <h1>User #${data.user.id}</h1><br>
        <img src="${data.user.photo}" alt="User photo" crossorigin="anonymous">
        <ul>
          <li>id: ${data.user.id}</li>
          <li>name: ${data.user.name}</li>
          <li>email: ${data.user.email}</li>
          <li>phone: ${data.user.phone}</li>
          <li>position: ${data.user.position}</li>
          <li>position_id: ${data.user.position_id}</li>
        </ul>
      `;
      navLinks.forEach(link => link.hidden = false);
    } else {
      showErrors(data, error);
    }
  })
  .catch(err => console.error(err));