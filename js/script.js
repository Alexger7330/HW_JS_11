class User {
    constructor({ name, email, address, phone }) {
        this.data = {
            id: `${Math.round(performance.now())}`,
            name,
            email,
            address,
            phone
        };
    }

    edit(data) {
        this.data = data;
    }

    get() {
        return this.data;
    }
}

class Contacts extends User {
    constructor(data) {
        super(data)

        this.data = [];
    }

    add(obj) {
        let user = new User(obj);
        this.data.push(user.data)
    }

    edit(id, obj) {
        this.data = this.data.map((item) => {
            if (item.id === id) {
                item = obj;
            }
            return item
        })
    }

    remove(id) {
        this.data = this.data.filter(item => item.id !== id)
    }

    get() {
        return this.data
    }
}

class ContactsApp extends Contacts {
    constructor(data) {
        super(data)
        this.app = document.createElement('div');
        this.app.classList.add('contacts')
        this.app.innerHTML = `<div class="contacts__wrapper">
        <div class="contacts__header">
            <h2 class="contacts__title">Contacts</h2>
            <div class = "contacts__inputs">
            <input type="text" class="contacts__input__name" placeholder="Name">
            <input type="email" class="contacts__input__email" placeholder="Email">
            <input type="text" class="contacts__input__address" placeholder="address">
            <input type="phone" class="contacts__input__phone" placeholder="Phone">
            </div>
            <button class = "add">Add contact</button>
        </div>
        <div class="contacts__content">
            <ul class="contacts_items"></ul>
        </div>    
      </div>`
        document.body.appendChild(this.app)
        this.onAdd()
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
        list.forEach(({ id, name, email, address, phone }) => {
            li += ` <li class="contact_book_item" id='${id}'>
                        <span class="contacts_info">
                            Имя: ${name}<br>
                            Email: ${email}<br>
                            Адрес: ${address}<br>
                            Телефон: ${phone}<br>
                        </span>
                        <button class="btn edit_btn" data-edit="${id}">Редактировать</button>
                        <button class="btn del_btn" data-del="${id}">Удалить</button>
                    </li>`
        });
        ul.innerHTML = li;

    }

    onAdd() {
        const addBtn = document.querySelector('.add');

        addBtn.addEventListener('click', () => {

            let inputs = this.inputsInform();
            let name = inputs[0];;
            let nameValue = name.value;

            let email = inputs[1].value;
            let emailValue = email.value;

            let address = inputs[2].value;
            let addresslValue = address.value;

            let phone = inputs[3].value;
            let phonelValue = phone.value;

            console.log('------------------------------------------------');
            console.log(nameValue, emailValue, addresslValue, phonelValue)
            super.add(nameValue, emailValue, addresslValue, phonelValue);
            super.get();

        });
    }

}

let contactsApp = new ContactsApp({})

console.log(contactsApp.app)
