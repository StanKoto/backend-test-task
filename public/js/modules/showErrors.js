export function showErrors(data, error) {
  let failInfo = `<h2>${data.message}</h2><br>`;
  if (data.fails) {
    failInfo += '<p>Fail reason:</p><br><ul>'
    for (const key of Object.keys(data.fails)) {
      failInfo += `<li>${data.fails[key]}</li>`;
    }
    failInfo += '</ul>';
  }
  error.innerHTML = failInfo;
};