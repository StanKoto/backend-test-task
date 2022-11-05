'use strict';

const users = document.querySelector('.display-users');
const error = document.querySelector('.error');

(function getUsers (url) {
  users.innerHTML = '';
  document.querySelector('.previous-page').hidden = true;
  document.querySelector('.previous-page').replaceWith(document.querySelector('.previous-page').cloneNode(true));
  const previousPage = document.querySelector('.previous-page');
  document.querySelector('.next-page').hidden = true;
  document.querySelector('.next-page').replaceWith(document.querySelector('.next-page').cloneNode(true));
  const nextPage = document.querySelector('.next-page');

  fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const count = data.count < data.total_users ? data.count : data.total_users;
      let usersHTML = `
        <h1>Page ${data.page} of ${data.total_pages}, showing ${count} of ${data.total_users} users</h1>
        <ul>
      `;
      for (const user of data.users) {
        usersHTML += `
          <li>
            <h1>User #${user.id}</h1>
            <span>
              <ul>
                <li>id: ${user.id}</li>
                <li>name: ${user.name}</li>
                <li>email: ${user.email}</li>
                <li>phone: ${user.phone}</li>
                <li>position: ${user.position}</li>
                <li>position_id: ${user.position_id}</li>
                <li>created_at: ${user.createdAt}</li>
                <li>updated_at: ${user.updatedAt}</li>
              </ul>
              <img src="${user.photo}" alt="User photo" crossorigin="anonymous">
            </span>
          </li>
        `;
      }
      users.innerHTML = usersHTML + '</ul>';
      if (data.links.prev_url !== null) {
        previousPage.addEventListener('click', e => {
          e.preventDefault();
          getUsers(data.links.prev_url);
        })
        previousPage.hidden = false;
      }
      if (data.links.next_url !== null) {
        nextPage.addEventListener('click', e => {
          e.preventDefault();
          getUsers(data.links.next_url);
        })
        nextPage.hidden = false;
      }
    } else {
      let failInfo = `<h1>${data.message}</h1>`;
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
}) (document.location.origin + '/api/v1/users' + document.location.search)