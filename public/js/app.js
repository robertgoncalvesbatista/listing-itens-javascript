let arr_storage = [];

function handleItemsList() {
    let selectorDiv = document.querySelector("#cardGroup");
    selectorDiv.innerHTML = "";

    arr_storage.forEach(element => {
        // Criando e estilizando card
        let nodeCard = document.createElement("div");
        nodeCard.classList.add("d-flex", "text-muted", "pt-3");

        // Criando e estilizando quadrado azul
        let nodeSquare = document.createElement("div");
        nodeSquare.style.cssText = "width: 32px; height: 32px;";
        nodeSquare.classList.add("bd-placeholder-img", "flex-shrink-0", "me-2", "rounded", "text-bg-primary");

        // Criando e estilizando div
        let nodeDiv = document.createElement("div");
        nodeDiv.classList.add("pb-3", "mb-0", "small", "lh-sm", "border-bottom", "w-100");

        // Criando e estilizando div
        let nodeDivName = document.createElement("div");
        nodeDivName.classList.add("d-flex", "justify-content-between");

        // Criando e estilizando strong do nome
        let nodeName = document.createElement("strong");
        let createTextName = document.createTextNode(element.name);
        nodeName.classList.add("text-gray-dark");
        nodeName.appendChild(createTextName);

        // Criando e estilizando link de deletar
        let nodeDeleteLink = document.createElement("a");
        let createDeleteLink = document.createTextNode("Deletar");
        nodeDeleteLink.href = `javascript:deleteItem(${element.id})`;
        nodeDeleteLink.appendChild(createDeleteLink);

        // Criando e estilizando span do email
        let nodeEmail = document.createElement("span");
        let createTextEmail = document.createTextNode(element.email);
        nodeEmail.classList.add("d-block");
        nodeEmail.appendChild(createTextEmail);

        // Criando e estilizando span da senha
        let nodePassword = document.createElement("span");
        let createTextPassword = document.createTextNode(element.password);
        nodePassword.classList.add("d-block");
        nodePassword.appendChild(createTextPassword);

        // Incorporando elementos
        nodeDivName.appendChild(nodeName);
        nodeDivName.appendChild(nodeDeleteLink);

        nodeDiv.appendChild(nodeDivName);
        nodeDiv.appendChild(nodeEmail);
        nodeDiv.appendChild(nodePassword);

        nodeCard.appendChild(nodeSquare);
        nodeCard.appendChild(nodeDiv);

        selectorDiv.appendChild(nodeCard);
    });

    console.log(arr_storage);
}

function createItem(thisForm) {
    const input_name = thisForm.inputName.value;
    const input_email = thisForm.inputEmail.value;
    const input_password = thisForm.inputPassword.value;

    let arr_form = {
        "id": arr_storage.length + 1,
        "name": input_name,
        "email": input_email,
        "password": input_password,
    };

    arr_storage.push(arr_form);

    handleItemsList();
}

function deleteItem(itenId) {
    delete arr_storage[itenId - 1];

    handleItemsList();
}