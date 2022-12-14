'use strict';

import { showErrors } from "../modules/showErrors.js";

const users = document.querySelector('.display-users');
const error = document.querySelector('.error');

(function getUsers (url) {
  let nextUrl = document.location.origin + document.location.pathname;
  let currentSearchParams = url.split('?')[1];
  if (!currentSearchParams) currentSearchParams = 'count=5'
  nextUrl = nextUrl.concat(`?${currentSearchParams}`)
  const nextTitle = 'Another page';
  const nextState = { additionalInformation: 'Loaded another page with search results' };
  window.history.pushState(nextState, nextTitle, nextUrl);

  users.innerHTML = '';
  document.querySelector('.previous-page').replaceWith(document.querySelector('.previous-page').cloneNode(true));
  const previousPage = document.querySelector('.previous-page');
  previousPage.hidden = true;
  document.querySelector('.next-page').replaceWith(document.querySelector('.next-page').cloneNode(true));
  const nextPage = document.querySelector('.next-page');
  nextPage.hidden = true;

  fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const count = data.count < data.total_users ? data.count : data.total_users;
      let usersHTML = `
        <h1>Page ${data.page} of ${data.total_pages}, showing up to ${count} of ${data.total_users} users</h1><br>
        <ul>
      `;
      for (const user of data.users) {
        usersHTML += `
          <li>
            <h2>User #${user.id}</h2><br>
            <img src="${user.photo}" alt="User photo" crossorigin="anonymous">
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
          </li><br>
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
      document.querySelector('.btn').hidden = false;
    } else {
      showErrors(data, error);
    }
  })
  .catch(err => console.error(err));
}) (document.location.origin + '/api/v1/users' + document.location.search)