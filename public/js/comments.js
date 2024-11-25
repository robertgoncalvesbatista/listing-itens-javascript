let selected = null;

// Função para abrir (ou criar) o banco de dados
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("commentsDB", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("comments")) {
        const objectStore = db.createObjectStore("comments", {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("inputName", "inputName", { unique: false });
        objectStore.createIndex("inputEmail", "inputEmail", { unique: false });
        objectStore.createIndex("inputDescription", "inputDescription", {
          unique: false,
        });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject("Erro ao abrir o banco de dados: " + event.target.errorCode);
    };
  });
}

// Função para adicionar um novo comentário
function addComment(db, comment) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["comments"], "readwrite");
    const objectStore = transaction.objectStore("comments");

    const request = objectStore.add(comment);

    request.onsuccess = function () {
      resolve("Comentário adicionado com sucesso!");
    };

    request.onerror = function () {
      reject("Erro ao adicionar comentário: " + request.error);
    };
  });
}

// Função para listar todos os comentários
function getAllComments(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["comments"], "readonly");
    const objectStore = transaction.objectStore("comments");

    const request = objectStore.getAll();

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject("Erro ao listar comentários: " + request.error);
    };
  });
}

// Função para atualizar um comentário
function updateComment(db, id, updatedComment) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["comments"], "readwrite");
    const objectStore = transaction.objectStore("comments");

    const request = objectStore.get(id);

    request.onsuccess = function () {
      const comment = request.result;

      if (comment) {
        // Atualiza os dados do comentário
        Object.assign(comment, updatedComment);

        const updateRequest = objectStore.put(comment);

        updateRequest.onsuccess = function () {
          resolve("Comentário atualizado com sucesso!");
        };

        updateRequest.onerror = function () {
          reject("Erro ao atualizar comentário: " + updateRequest.error);
        };
      } else {
        reject("Comentário não encontrado");
      }
    };

    request.onerror = function () {
      reject("Erro ao buscar comentário para atualização: " + request.error);
    };
  });
}

// Função para deletar um comentário
function deleteComment(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["comments"], "readwrite");
    const objectStore = transaction.objectStore("comments");

    const request = objectStore.delete(id);

    request.onsuccess = function () {
      resolve(`Comentário com id ${id} removido com sucesso!`);
    };

    request.onerror = function () {
      reject("Erro ao excluir comentário: " + request.error);
    };
  });
}

// Função para renderizar os comentários na página
function renderComments(comments) {
  const cardGroupSelector = document.querySelector("#cardGroup");
  cardGroupSelector.innerHTML = ""; // Limpa a lista

  comments.forEach((comment) => {
    // Criando e estilizando card
    let nodeCard = document.createElement("div");
    nodeCard.style.cssText = "width: 100%; margin: 0 auto";
    nodeCard.classList.add("d-flex", "text-muted", "pt-3", "border-bottom");

    // Criando e estilizando quadrado azul
    let nodeSquare = document.createElement("div");
    nodeSquare.style.cssText = "max-width: 32px; height: 32px; width: 100%";
    nodeSquare.classList.add(
      "bd-placeholder-img",
      "rounded",
      "text-bg-primary"
    );

    // Criando e estilizando div
    let nodeContent = document.createElement("div");
    nodeContent.classList.add("small");
    nodeContent.style.cssText = "width: 100%; padding: 0 1rem";

    // Criando e estilizando button group
    let nodeButtonGroup = document.createElement("div");
    nodeButtonGroup.style.cssText =
      "gap: 0.5rem; display: flex; align-items: baseline; width: 92px";

    // Criando e estilizando botão de deletar
    let nodeButtonDelete = document.createElement("button");
    nodeButtonDelete.classList.add("btn", "btn-outline-primary");
    nodeButtonDelete.onclick = async () => {
      const db = await openDB();
      await deleteComment(db, comment.id);
      loadComments();
    };

    let iconDelete = document.createElement("i");
    iconDelete.classList.add("fa-solid", "fa-trash");
    iconDelete.style.cssText = "width: 16px; height: 16px";

    nodeButtonDelete.appendChild(iconDelete);

    // Criando e estilizando botão de editar
    let nodeButtonEdit = document.createElement("button");
    nodeButtonEdit.classList.add("btn", "btn-outline-primary");
    nodeButtonEdit.onclick = () => {
      selected = comment.id;

      document.getElementById("title").innerHTML =
        "Formulário - Edição ID nº " + comment.id;

      document.getElementById("inputName").value = comment.name;
      document.getElementById("inputEmail").value = comment.email;
      document.getElementById("inputDescription").value = comment.description;
    };

    let iconEdit = document.createElement("i");
    iconEdit.classList.add("fa-solid", "fa-pen");
    iconEdit.style.cssText = "width: 16px; height: 16px";

    nodeButtonEdit.appendChild(iconEdit);

    // Criando e estilizando strong do nome
    let nodeName = document.createElement("strong");
    let createTextName = document.createTextNode(comment.name);
    nodeName.classList.add("text-gray-dark");
    nodeName.appendChild(createTextName);

    // Criando e estilizando span do email
    let nodeEmail = document.createElement("span");
    let createTextEmail = document.createTextNode(comment.email);
    nodeEmail.classList.add("d-block");
    nodeEmail.appendChild(createTextEmail);

    // Criando e estilizando span da descrição
    let nodeDescription = document.createElement("span");
    let createTextDescription = document.createTextNode(comment.description);
    nodeDescription.classList.add("d-block", "max-two-lines");
    nodeDescription.appendChild(createTextDescription);

    // Incorporando elementos
    nodeContent.appendChild(nodeName);
    nodeContent.appendChild(nodeEmail);
    nodeContent.appendChild(nodeDescription);

    nodeButtonGroup.appendChild(nodeButtonDelete);
    nodeButtonGroup.appendChild(nodeButtonEdit);

    nodeCard.appendChild(nodeSquare);
    nodeCard.appendChild(nodeContent);
    nodeCard.appendChild(nodeButtonGroup);

    cardGroupSelector.appendChild(nodeCard);
  });
}

// Função para carregar e listar os comentários
async function loadComments() {
  const db = await openDB();
  const comments = await getAllComments(db);
  renderComments(comments);
}

// Função para adicionar um novo comentário através do formulário
async function handleAddComment(event) {
  event.preventDefault();

  const name = document.getElementById("inputName").value;
  const email = document.getElementById("inputEmail").value;
  const description = document.getElementById("inputDescription").value;

  if (name && email && description) {
    const comment = { name, email, description, date: new Date() };
    const db = await openDB();

    if (selected) {
      await updateComment(db, selected, {
        name: comment.name,
        email: comment.email,
        description: comment.description,
      });

      document.getElementById("title").innerHTML = "Formulário";

      selected = null;
    } else {
      await addComment(db, comment);
    }

    loadComments();

    // Limpa os campos do formulário
    document.getElementById("inputName").value = "";
    document.getElementById("inputEmail").value = "";
    document.getElementById("inputDescription").value = "";
  } else {
    alert("Por favor, preencha todos os campos.");
  }
}

// Adiciona o evento de submissão no formulário
document
  .getElementById("commentForm")
  .addEventListener("submit", handleAddComment);

// Carrega os comentários ao inicializar
loadComments();
