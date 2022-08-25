class User {
    constructor({ id, name, email, address, phone }) {
        this.data = {
            id: id || `${Math.round(performance.now())}`,
            name,
            email,
            address,
            phone,
        };
    }

    edit(data) {
        this.data = data;
    }

    get() {
        return this.data;
    }
}

class Contacts {
    constructor() {
        this.contactsData = [];
    }

    add(userData) {
        let addedUser = new User(userData);
        this.contactsData.push(addedUser);
    }

    edit(idUser, newUserData) {
        this.contactsData = this.contactsData.map((userContacts) => {
            const id = userContacts.get().id;
            const userData = userContacts.get();
            if (id === idUser) {
                userContacts.edit({
                    ...userData,
                    ...newUserData,
                });
            }
            return userContacts;
        });
    }

    remove(idUser) {
        this.contactsData = this.contactsData.filter((userContacts) => {
            const id = userContacts.get().id;
            return id !== idUser;
        });
    }

    get() {
        return this.contactsData;
    }
}


class ContactsApp extends Contacts {
    constructor(data) {
        super(data)
        this.contactsData = this.storage || [];
        this.app = document.createElement('div');
        this.app.classList.add('contacts')
        this.app.innerHTML = `<div class="contacts__wrapper">
        <div class="contacts__header">
            <h2 class="contacts__title">Contacts</h2>
            <div class = "contacts__inputs">
            <input type="text" class="contacts__input__name" placeholder="Name" value = 'Alex'>
            <input type="email" class="contacts__input__email" placeholder="Email" value = 'alex@gmail.com'>
            <input type="text" class="contacts__input__address" placeholder="Address" value = 'Bla'>
            <input type="phone" class="contacts__input__phone" placeholder="Phone" value = '465465'>
            </div>
            <button class = "add">Add contact</button>
        </div>
        <div class="contacts__content">
            <ul class="contacts_items"></ul>
        </div>    
      </div>`
        document.body.appendChild(this.app)
        this.checkCookie();
        this.onAdd();
        this.get()
    }


    inputsInform() {
        let inputName = document.querySelector('.contacts__input__name');
        let inputEmail = document.querySelector('.contacts__input__email');
        let inputAddress = document.querySelector('.contacts__input__address');
        let inputPhone = document.querySelector('.contacts__input__phone');
        return [inputName, inputEmail, inputAddress, inputPhone];
    }

    get() {
        const ul = document.querySelector('.contacts_items');
        let li = '';
        let list = super.get();
        list.forEach(({ data: { id, name, email, address, phone } }) => {
            if (id && name && email && address && phone) {
                li += ` <li class="contact_book_item" id='${id}'>
                        <p class="contacts_info">
                            Имя: ${name}<br>
                            Email: ${email}<br>
                            Адрес: ${address}<br>
                            Телефон: ${phone}<br>
                        </p>
                        <button class="btn edit_btn" data-edit="${id}">Редактировать</button>
                        <button class="btn del_btn" data-del="${id}">Удалить</button>
                    </li>`
            }
        });
        ul.innerHTML = li;
        this.btnDellListener();
        this.btnEditListener();
    }

    onAdd() {
        const addBtn = document.querySelector('.add');

        addBtn.addEventListener('click', (event) => {

            let inputs = this.inputsInform();
            let name = inputs[0];
            let nameValue = name.value;

            let email = inputs[1];
            let emailValue = email.value;

            let address = inputs[2];
            let addresslValue = address.value;

            let phone = inputs[3];
            let phonelValue = phone.value;

            this.add({
                name: nameValue,
                email: emailValue,
                address: addresslValue,
                phone: phonelValue
            });
            this.storage = this.contactsData
            this.get();

            name.value = '';
            email.value = '';
            address.value = '';
            phone.value = '';

        });
    }

    btnEditListener() {
        const edit_buttons = document.querySelectorAll('.edit_btn');
        edit_buttons.forEach((elem) => {
            elem.addEventListener('click', (event) => {
                let chooseId = event.target.dataset.edit;

                super.get().find((user) => {
                    if (user.data.id === chooseId) {
                        this.modal(user.data)
                    }
                })
            })
        });
    }

    onEdit(id, name, email, address, phone) {
        this.edit(id, { id, name, email, address, phone });
        this.storage = this.contactsData;
        this.get();
    }

    btnDellListener() {
        const del_btns = document.querySelectorAll('.del_btn');
        del_btns.forEach((elem) => {
            elem.addEventListener('click', (event) => {
                this.onRemove(event.target.dataset.del);
            })
        })
    }
    onRemove(id) {
        this.remove(id);
        this.storage = this.contactsData
        this.get();
    }

    get storage() {
        let contactsData = localStorage.getItem('contactsData');
        let localArr = [];
        if (contactsData !== null) {

            localArr = JSON.parse(contactsData);
            localArr = localArr.map((elem) => {
                let data = elem.data;
                elem = new User(data);
                return elem;
            })
        } else {
            return false;
        }
        return localArr;
    }

    set storage(newContactsData) {
        localStorage.setItem('contactsData', JSON.stringify(newContactsData))
        this.cookiesLife()
    }

    getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    checkCookie() {
        if (this.getCookie('storageExpiration') === undefined) {
            localStorage.clear();
        }
    }

    cookiesLife() {
        let date = new Date(Date.now());
        document.cookie = 'storageExpiration=' + date.toUTCString() + ';max-age=864000';
    }

    modal({ id, name, email, address, phone }) {
        const elementModal = document.createElement("div");
        elementModal.classList.add("modal");

        elementModal.innerHTML = `<div class="modal__container">
                                          <div class="modal__wrapper">
                                              <h2>Edit Modal</h2>
                                              <div class = "modal__inputs">
                                                    <input type="text" class="modal__input__name" placeholder="Name" value = '${name}'>
                                                    <input type="email" class="modal__input__email" placeholder="Email" value = '${email}'>
                                                    <input type="text" class="modal__input__address" placeholder="Address" value = '${address}'>
                                                    <input type="phone" class="modal__input__phone" placeholder="Phone" value = '${phone}'>
                                                </div>
                                                <button class = 'modal__save'>Save</button>
                                              <button class = 'modal__closeBtn'><i class="fa fa-times" aria-hidden="true"></i></button>
                                          </div>
                                         <div>`;
        document.body.appendChild(elementModal);


        const saveBtn = document.querySelector(".modal__save");
        saveBtn.addEventListener("click", () => {

            const inputName = document.querySelector('.modal__input__name');
            const inputEmail = document.querySelector('.modal__input__email');
            const inputAddress = document.querySelector('.modal__input__address');
            const inputPhone = document.querySelector('.modal__input__phone');

            let name = inputName.value;

            let email = inputEmail.value;

            let address = inputAddress.value;

            let phone = inputPhone.value;

            this.onEdit(id, name, email, address, phone)
            elementModal.remove();
        });

        elementModal.addEventListener("click", (e) => {
            if (e.target.classList[0] === "modal__container") {
                elementModal.remove();
            }
        });

        const closeBtn = document.querySelector(".modal__closeBtn");
        closeBtn.addEventListener("click", () => {
            elementModal.remove();
        });

    }

};


let contactsApp = new ContactsApp()
