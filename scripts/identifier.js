const form = document.getElementById('form');
const firstTimeButton = document.getElementById('firstTimeButton');
const returningVisitorButton = document.getElementById('returningVisitorButton');


form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  // Generate the identifier based on the form inputs
  const identifier = form.street.value.charAt(0) +
                     form.surname.value.charAt(0) +
                     form.age.value.toString().charAt(0) +
                     form.city.value.charAt(0) +
                     form.hobby.value.charAt(0) +
                     form.birthday.value.toString().charAt(0);
  
  // Store the identifier in localStorage or send it to a server
  localStorage.setItem('identifier', identifier);
  
  // Redirect to the choice page
window.location.href = "choice.html";

});
