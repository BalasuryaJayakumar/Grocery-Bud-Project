const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery_form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit_btn");
const container = document.querySelector(".grocery_container");
const list = document.querySelector(".grocery_list");
const clearBtn = document.querySelector(".clear_btn");

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItem);
window.addEventListener("DOMContentLoaded", setUpItem);

/* Edit Option */

let editElement;
let editFlag = false;
let editId = "";

/* functions */



function addItem (event) {
    event.preventDefault();
    const value = grocery.value;
    const Id = new Date().getTime().toString();

    if( value && !editFlag) {
        createListItems(Id, value);
        displayAlert("item added to the list", "success");
        container.classList.add("show_container");
        addToLocalStorage(Id, value);
        setBackToDefault();
    } else if ( value && editFlag) {
        editElement.innerHTML = value;
        displayAlert("value changed", "success");
        editLocalStorage(editId, value);
        setBackToDefault();
    } else {
        displayAlert("please enter value", "danger");
    }
}

function clearItem () {
    const items = document.querySelectorAll(".grocery_item");
    if (items.length > 0) {
        items.forEach((item) => {
            list.removeChild(item);
        });
    }
    container.classList.remove("show_container");
    displayAlert("empty list", "danger");
    localStorage.removeItem("list");
    setBackToDefault()
}


/* display alert function */

const displayAlert = (text, action) => {
    alert.textContent = text;
    alert.classList.add(`${action}`);

    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`${action}`);
    }, 1000);
};

/* delet items function */

function deletItem (event) {
    const element = event.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0 ) {
        container.classList.remove("show_container");
    }
    
    displayAlert("item removed", "danger");
    removeFromLocalStorage(id);
    setBackToDefault();
}

/* edit items function */

function editItem (event) {
    editElement = event.currentTarget.parentElement.previousElementSibling;
    const element = event.currentTarget.parentElement.parentElement;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = "edit";
}

/* setBackToDefault function */

const setBackToDefault = () => {
    grocery.value = "";
    editFlag = false;
    editId = "";
    submitBtn.textContent = "submit";
}

/* add to local storage function */

const addToLocalStorage = (id, value) => {
    const grocery = { id, value };
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
}

/* edit data from local storage function */

const editLocalStorage = (id, value) => {
    let items = getLocalStorage();
    items = items.map((item) => {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}


/* remove data from local storage function */

const removeFromLocalStorage = (id) => {
    let items = getLocalStorage();
    items = items.filter((item) => {
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
}

/* get data from local storage function */

const getLocalStorage = () => {
    return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [] ;
}

/* setup items from local storage */ 

function setUpItem () {
    let items = getLocalStorage();
    if (items.length > 0 ) {
        items.forEach((item) => {
            createListItems(item.id, item.value);
        })
        container.classList.add("show_container");
    }
}

/* creatlistItem function */

const createListItems = (id, value) => {
    const element = document.createElement("article");
    element.classList.add("grocery_item");
    const attribute = document.createAttribute("data-id");
    attribute.value = id;
    element.setAttributeNode(attribute);
    element.innerHTML = `<p class="title"> ${value} </p>
                        <div class="btn_container">
                            <button type="button" class="edit_btn"><i class="fas fa-edit"></i></button>
                            <button type="button" class="dlt_btn"><i class="fas fa-trash"></i></button>
                        </div>`;
    const editBtn = element.querySelector(".edit_btn");
    const dltBtn = element.querySelector(".dlt_btn");

    editBtn.addEventListener("click", editItem);
    dltBtn.addEventListener("click", deletItem);

    list.appendChild(element);
}