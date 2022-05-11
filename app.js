// ****** SELECT ITEMS **********
const alerta = document.querySelector('.alerta');
const form = document.querySelector('.compras-form');
const compras = document.getElementById('compras');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.container-compras');
const lista = document.querySelector('.lista-compras');
const clearBtn = document.querySelector('.clear-btn');

// edit option
let editElement;
let editFlag = false;
let editID = "";
// ****** EVENT LISTENERS **********
form.addEventListener('submit',addItem)
//limpar lista
clearBtn.addEventListener('click', clearItems)
//carregar items
window.addEventListener('DOMContentLoaded', setupItems);
// FUNÇÔES
function addItem(e) {
    e.preventDefault();
    const value = compras.value;
    const id = new Date().getTime().toString();
    if(value && !editFlag){
        criarListaCompras(id, value);
    //display alerta
    displayAlerta("Item adicionado na lista", "sucesso");
    //amostra lista
    container.classList.add('show-container');
    //adiciona na memoria local
    addtoLocalStorage(id,value);
    //de volta ao default
    setBackToDefault();
    }
    else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlerta('Item editado', 'sucesso');
        //editar memoria local
        editLocalStorage(editID, value);
        setBackToDefault();
    }
    else{
        console.log('Não é um item');
        displayAlerta("Falta um valor", "erro");
    }
}
//alertas
function displayAlerta(text, action){
    alerta.textContent = text;
    alerta.classList.add(`alerta-${action}`);
    //remover alerta
    setTimeout(function(){
        alerta.textContent = '';
        alerta.classList.remove(`alerta-${action}`);
    },1000);
}
//limpar lista
function clearItems(){
    const items = document.querySelectorAll('.item-compra');

    if(items.length > 0){
        items.forEach(function(item){
            lista.removeChild(item)
        });
    }
    container.classList.remove('show-container');
    displayAlerta("Lista vazia","erro");
    setBackToDefault();
    localStorage.removeItem("lista");
}
//função deletar
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    lista.removeChild(element);
    if(lista.children.length === 0){
        container.classList.remove('show-container');
    }
    displayAlerta('Item removido', 'erro');
    setBackToDefault();
    // remover da memoria
    removeFromLocalStorage(id);
}
//função editar
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    //item para edição
    editElement = e.currentTarget.parentElement.previousElementSibling;
    //value do form
    compras.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "Editar";
}
//de volta pro default
function setBackToDefault(){
     console.log("De volta ao default");
     compras.value = "";
     editFlag = false;
     editID = "";
     submitBtn.textContent = "Adicionar";
 }
// ****** LOCAL STORAGE **********
 function addtoLocalStorage(id,value){
    const compras = {id:id,value:value};
    let items = getLocalStorage();

    items.push(compras);
    localStorage.setItem('lista',JSON.stringify(items));
 }

 function removeFromLocalStorage(id){
    let items = getLocalStorage();

    items = items.filter(function(item){
        if(item.id !== id){
         return item;
        }
    })
    localStorage.setItem('lista',JSON.stringify(items));
 }

 function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    })
    localStorage.setItem('lista',JSON.stringify(items));
 }

 function getLocalStorage(){
    return localStorage.getItem("lista")?JSON.parse(localStorage.getItem("lista")):[];
 }
 //localStorage API
 //setItem
 //getItem
 //removeItem
 //Salvar como string
// ****** SETUP ITEMS **********
function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            criarListaCompras(item.id, item.value);
        })
        container.classList.add('show-container');
    }
}

function criarListaCompras(id, value){

    console.log('Adicionando item na lista');
     const element = document.createElement("article");
     //adicionar classe
     element.classList.add("item-compra");
     //atribuir id
     const attr = document.createAttribute("data-id");
     attr.value = id;
     element.setAttributeNode(attr);
     element.innerHTML = `<p class="title">${value}</p>
                            <div class="btn-container">
                            <button type="button" class="edit-btn">
                            <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="delete-btn">
                            <i class="fas fa-trash"></i>
                            </button>
                            </div>`;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    //append filho
    lista.appendChild(element);
}