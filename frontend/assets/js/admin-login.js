if (getToken()) {
  window.location.replace('dashboard.html');
}

document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorBox = document.getElementById('loginError');
  errorBox.classList.add('d-none');

  const usuario = document.getElementById('usuario').value.trim();
  const password = document.getElementById('password').value;

  try {
    const { token } = await api.post('/auth/login', { usuario, password });
    setToken(token);
    window.location.href = 'dashboard.html';
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove('d-none');
  }
});
