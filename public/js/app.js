let storage = [];
let selected;

function handleItemsList() {
  let cardGroupSelector = document.querySelector("#cardGroup");
  cardGroupSelector.innerHTML = "";

  storage.forEach((element) => {
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
    nodeButtonDelete.onclick = () => deleteItem(element);

    let iconDelete = document.createElement("i");
    iconDelete.classList.add("fa-solid", "fa-trash");
    iconDelete.style.cssText = "width: 16px; height: 16px";

    nodeButtonDelete.appendChild(iconDelete);

    // Criando e estilizando botão de editar
    let nodeButtonEdit = document.createElement("button");
    nodeButtonEdit.classList.add("btn", "btn-outline-primary");
    nodeButtonEdit.onclick = () => editItem(element);

    let iconEdit = document.createElement("i");
    iconEdit.classList.add("fa-solid", "fa-pen");
    iconEdit.style.cssText = "width: 16px; height: 16px";

    nodeButtonEdit.appendChild(iconEdit);

    // Criando e estilizando strong do nome
    let nodeName = document.createElement("strong");
    let createTextName = document.createTextNode(element.name);
    nodeName.classList.add("text-gray-dark");
    nodeName.appendChild(createTextName);

    // Criando e estilizando span do email
    let nodeEmail = document.createElement("span");
    let createTextEmail = document.createTextNode(element.email);
    nodeEmail.classList.add("d-block");
    nodeEmail.appendChild(createTextEmail);

    // Criando e estilizando span da descrição
    let nodeComment = document.createElement("span");
    let createTextComment = document.createTextNode(element.comment);
    nodeComment.classList.add("d-block", "max-two-lines");
    nodeComment.appendChild(createTextComment);

    // Incorporando elementos
    nodeContent.appendChild(nodeName);
    nodeContent.appendChild(nodeEmail);
    nodeContent.appendChild(nodeComment);

    nodeButtonGroup.appendChild(nodeButtonDelete);
    nodeButtonGroup.appendChild(nodeButtonEdit);

    nodeCard.appendChild(nodeSquare);
    nodeCard.appendChild(nodeContent);
    nodeCard.appendChild(nodeButtonGroup);

    cardGroupSelector.appendChild(nodeCard);
  });
}

function handleSubmit(thisForm) {
  const { inputName, inputEmail, inputComment } = thisForm;

  const card = {
    id: Math.random().toString(16).slice(2),
    name: inputName.value,
    email: inputEmail.value,
    comment: inputComment.value,
  };

  if (selected !== undefined) {
    const index = storage.findIndex((value) => {
      return value.id === selected;
    });

    storage[index] = card;

    selected = undefined;
  } else {
    storage.push(card);
  }

  handleItemsList();
}

function editItem(item) {
  const name = document.getElementById("inputName");
  const email = document.getElementById("inputEmail");
  const comment = document.getElementById("inputComment");

  const index = storage.findIndex((value) => {
    return value.id === item.id;
  });

  name.value = storage[index].name;
  email.value = storage[index].email;
  comment.value = storage[index].comment;

  selected = item.id;

  handleItemsList();
}

function deleteItem(item) {
  const index = storage.findIndex((value) => {
    return value.id === item.id;
  });

  delete storage[index];

  handleItemsList();
}
