const form = document.getElementById('signupForm');
const first = document.getElementById('first');
const last = document.getElementById('last');
const email = document.getElementById('email');
const password = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const statusEl = document.getElementById('status');
const emailHint = document.getElementById('emailHint');
const togglePass = document.getElementById('togglePass');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function fieldValid(name, value){
    if(name === 'first' || name === 'last') return value.trim().length > 0;
    if(name === 'email') return emailPattern.test(value.trim());
    if(name === 'password') return value.length >= 4;
    return false;
  }

  function updateChecklist(){
    [first, last, email, password].forEach(input => {
      const row = document.querySelector('.check-row[data-for="' + input.name + '"]');
      const valid = fieldValid(input.name, input.value);
      if(row) row.classList.toggle('done', valid);
      input.classList.toggle('invalid', input.value.length > 0 && !valid);
    });

    if(email.value.length > 0 && !emailPattern.test(email.value.trim())){
      emailHint.textContent = 'That doesn\'t look like a valid email yet.';
      emailHint.classList.add('error');
    } else {
      emailHint.textContent = '';
      emailHint.classList.remove('error');
    }
  }

  [first, last, email, password].forEach(input => {
    input.addEventListener('input', updateChecklist);
  });

  togglePass.addEventListener('click', function(){
    const isPass = password.type === 'password';
    password.type = isPass ? 'text' : 'password';
    togglePass.textContent = isPass ? 'Hide' : 'Show';
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();

    const allValid = ['first','last','email','password'].every(name => {
      const el = document.getElementById(name);
      return fieldValid(name, el.value);
    });

    if(!allValid){
      updateChecklist();
      statusEl.textContent = 'Please fill in every field correctly before continuing.';
      statusEl.className = 'status err';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span>Creating account…';
    statusEl.textContent = '';
    statusEl.className = 'status';

    fetch('/adder', {
      method: 'POST',
      body: JSON.stringify({
        first: first.value,
        last: last.value,
        email: email.value,
        password: password.value,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(res){ return res.json(); })
    .then(function(body){
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create account';
      statusEl.textContent = 'Account created — welcome aboard, ' + first.value + '.';
      statusEl.className = 'status ok';
      form.reset();
      updateChecklist();
    })
    .catch(function(err){
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create account';
      statusEl.textContent = 'Something went wrong. Please try again.';
      statusEl.className = 'status err';
      console.error(err);
    });
  });