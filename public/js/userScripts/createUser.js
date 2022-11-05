'use strict';

const form = document.querySelector('.registration-form');
const success = document.querySelector('.success');
const usernameError = { element: document.querySelector('.username.error'), failReason: 'name' };
const emailError = { element: document.querySelector('.email.error'), failReason: 'email' };
const phoneError = { element: document.querySelector('.phone.error'), failReason: 'phone' };
const positionIdError = { element: document.querySelector('.position_id.error'), failReason: 'position_id' };
const photoError = { element: document.querySelector('.photo.error'), failReason: 'photo' };
const formErrors = [ usernameError, emailError, phoneError, positionIdError, photoError ];
const otherError = document.querySelector('.other.error');

form.addEventListener('submit', e => {
  e.preventDefault();

  document.querySelector('.username.error').textContent = '';
  document.querySelector('.email.error').textContent = '';
  document.querySelector('.phone.error').textContent = '';
  document.querySelector('.position_id.error').textContent = '';
  document.querySelector('.photo.error').textContent = '';
  success.innerHTML = '';
  otherError.innerHTML = '';
  
  fetch(document.location.origin + '/api/v1/token')
    .then(res => res.json())
    .then(data => {
      const formData = new FormData();
      formData.append('name', form.username.value);
      formData.append('email', form.email.value);
      formData.append('phone', form.phone.value);
      formData.append('position_id', form.position_id.value);
      formData.append('photo', document.querySelector("input[type=file]").files[0]);
      
      fetch(document.location.origin + '/api/v1/users', {
        method: 'POST',
        headers: { 'Token': data.token },
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          form.reset();
          if (data.success) {
            success.innerHTML = `
              <h3>${data.message}: new user's id equals ${data.user_id}</h3>
            `;
          } else {
            if (data.fails) {
              for (const error of formErrors) {
                if (data.fails.hasOwnProperty(error.failReason)) {
                  error.element.textContent = data.fails[error.failReason];
                  delete data.fails[error.failReason];
                }
              }
            }
            otherError.innerHTML = `<h2>${data.message}</h2>`;
          }
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
});
