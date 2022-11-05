'use strict';

const user = document.querySelector('.display-user');
const navLinks = document.querySelector('.nav-links');
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
      navLinks.hidden = false;
    } else {
      let failInfo = `<h2>${data.message}</h2>`;
      if (data.fails) {
        failInfo += '<p>Fails:</p><ul>'
        for (const key of Object.keys(data.fails)) {
          failInfo += `<li>${key}: ${data.fails[key]}</li>`;
        }
        failInfo += '</ul>';
      }
      error.innerHTML = failInfo;
    }
  })
  .catch(err => console.error(err));