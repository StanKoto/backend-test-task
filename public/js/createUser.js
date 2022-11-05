'use strict';

const form = document.querySelector('.registration-form');
const success = document.querySelector('.success');
const error = document.querySelector('.error');

form.addEventListener('submit', e => {
  e.preventDefault();

  success.innerHTML = '';
  error.innerHTML = '';
  
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
    })
    .catch(err => console.error(err));
});
