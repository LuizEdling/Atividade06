const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'dmwq7894789321m4hretureh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 300000 }
}));

const usuariosRegistrados = [
  { "username": "user1", "password": "senha1", "fullName": "Usuario 1" },
  { "username": "user2", "password": "senha2", "fullName": "Usuario 2" },
  { "username": "user3", "password": "senha3", "fullName": "Usuario 3" }
];

app.get('/login', (req, res) => {
  res.send(`
    <h1>Tela de Login</h1>
    <form method="POST" action="/login">
      <label>Usuário: 
        <input type="text" name="username" required/>
      </label>
      <label>Senha: 
        <input type="password" name="password" required/>
      </label>
      <br>
      <button type="submit">Entrar</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const usuarioRegistrado = usuariosRegistrados.find(u => u.username === username && u.password === password);

  if (usuarioRegistrado) {
    req.session.currentUser = usuarioRegistrado.fullName;
    res.redirect('/home');
  } else {
    res.send('Usuário ou senha não encontrados!. <a href="/login">Clique aqui para tentar novamente</a>');
  }
});

app.get('/home', (req, res) => {
  if (req.session.currentUser) {
    res.send(`
      <h2>Bem-vindo, ${req.session.currentUser}!</h2>
      <p>Você está logado!</p>
      <a href="/logout">Sair</a>
    `);
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

app.listen(3000, () => {
  console.log('Servidor em execução em http://localhost:3000/login');
});