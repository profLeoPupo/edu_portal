// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCgbMW_jSU4DWOwIWXP4s0OR09h80sOcCU",
  authDomain: "login-aluno.firebaseapp.com",
  projectId: "login-aluno",
  storageBucket: "login-aluno.firebasestorage.app",
  messagingSenderId: "247758317971",
  appId: "1:247758317971:web:7601125b6ab288ef17e066",
  measurementId: "G-WW3WQGDJ3J"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener("DOMContentLoaded", () => {
  // Alternar formulários
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");
  const loginFormDiv = document.getElementById("login-form");
  const registerFormDiv = document.getElementById("register-form");

  if (showRegister && showLogin) {
    showRegister.addEventListener("click", (e) => {
      e.preventDefault();
      loginFormDiv.style.display = "none";
      registerFormDiv.style.display = "block";
    });

    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      registerFormDiv.style.display = "none";
      loginFormDiv.style.display = "block";
    });
  }

  // LOGIN
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const senha = document.getElementById("password").value;

      auth.signInWithEmailAndPassword(email, senha)
        .then(userCred => {
          const user = userCred.user;
          localStorage.setItem("aluno_email", user.email);
          localStorage.setItem("aluno_nome", user.displayName || "Aluno(a)");
          window.location.href = "aluno-dashboard.html";
        })
        .catch(err => {
          alert("Erro no login: " + err.message);
        });
    });
  }

  // CADASTRO
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = document.getElementById("fullname").value;
      const email = document.getElementById("reg-email").value;
      const senha = document.getElementById("reg-password").value;
      const confirmar = document.getElementById("confirm-password").value;

      if (senha !== confirmar) {
        alert("As senhas não coincidem!");
        return;
      }

      auth.createUserWithEmailAndPassword(email, senha)
        .then((userCred) => {
          const user = userCred.user;
          return user.updateProfile({ displayName: nome })
            .then(() => {
              localStorage.setItem("aluno_nome", nome);
              localStorage.setItem("aluno_email", email);
              alert("Cadastro realizado com sucesso! Agora faça login.");
              registerForm.reset();
              registerFormDiv.style.display = "none";
              loginFormDiv.style.display = "block";
            });
        })
        .catch(err => {
          alert("Erro no cadastro: " + err.message);
        });
    });
  }

  // LOGIN COM GOOGLE
  const googleBtn = document.getElementById("google-login");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
        .then(result => {
          const user = result.user;
          localStorage.setItem("aluno_email", user.email);
          localStorage.setItem("aluno_nome", user.displayName || "Aluno(a)");
          alert(`Bem-vindo, ${user.displayName}`);
          window.location.href = "aluno-dashboard.html";
        })
        .catch(err => {
          alert("Erro no login com Google: " + err.message);
        });
    });
  }
});
