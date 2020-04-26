import moment from 'moment';

const url = 'http://localhost:7070/tickets';

const addButton = document.getElementById('add_btn');
const modalTicket = document.querySelector('#modal_ticket');
const modalEditTicket = document.getElementById('modal_edit_ticket');
const modalDelete = document.getElementById('modal_delete');
const tickets = document.getElementById('tickets');

const nameInput = document.getElementById('name_input');
const descInput = document.getElementById('desc_input');
const nameInputEdit = document.getElementById('name_input_edit');
const descInputEdit = document.getElementById('desc_input_edit');

let ticketId;


const showTickets = (inp) => {
  let status;
  if (inp.status) {
    status = '&#10004;';
  } else {
    status = '';
  }
  const html = `
  <div class="ticket" id="${inp.id}">
  <div class="ticket_block">
    <div class="status">${status}</div>
      <div class="name">${inp.name}</div>
      <div class="date">${moment(inp.created).format('DD.MM.YY HH:mm')}</div>
      <div class="btns">
        <input type="button" class="edit_btn" value="✎" />
        <input type="button" class="del_btn" value="X" />
      </div>
    </div>
  </div>
`;
  return html;
};


const makeList = (arr) => {
  tickets.innerHTML = '';
  const arrNew = arr.map((item) => showTickets(item));
  arrNew.forEach((item) => {
    tickets.insertAdjacentHTML('beforeend', item);
  });
};

async function getData() {
  const response = await fetch(url);
  if (response.ok) {
    const json = await response.json();
    makeList(json);
  } else {
    console.error(`Ошибка ${response.status}`);
  }
}

// ADD NEW TICKET
addButton.addEventListener('click', (event) => {
  event.preventDefault();
  modalTicket.classList.remove('hidden');
});

// ADD TICKET
modalTicket.addEventListener('click', async (event) => {
  event.preventDefault();
  if (event.target.classList.contains('submit_btn')) {
    const data = {
      name: nameInput.value,
      description: descInput.value,
    };
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(data),
    }).then(() => {
      console.log('add');
    }).catch((err) => {
      console.error(err);
    });

    modalTicket.reset();
    getData();
    modalTicket.classList.add('hidden');
  } else if (event.target.classList.contains('cancel_btn')) {
    modalTicket.classList.add('hidden');
  }
});

// CLICKS ON TICKETS
tickets.addEventListener('click', async (event) => {
  event.preventDefault();
  ticketId = event.target.closest('.ticket').id;
  if (event.target.classList.contains('del_btn')) {
    // click on delete button
    modalDelete.classList.remove('hidden');
  } else if (event.target.classList.contains('edit_btn')) {
    // click on edit button
    modalEditTicket.classList.remove('hidden');
    await fetch(`${url}/${ticketId}`, {
      method: 'GET',
    }).then(async (response) => {
      const ticketFull = await response.json();
      nameInputEdit.value = ticketFull.name;
      descInputEdit.value = ticketFull.description;
    }).catch((err) => {
      console.error(err);
    });
  } else if (event.target.classList.contains('status')) {
    // click on status button
    await fetch(`${url}/${ticketId}`, {
      method: 'PUT',
    }).then(() => {
      console.log('check ticket');
    }).catch((err) => {
      console.error(err);
    });
    getData();
  } else {
    // click to show description
    const ticketDesc = event.target.closest('.ticket').querySelector('.desc');
    if (ticketDesc) {
      ticketDesc.parentNode.removeChild(ticketDesc);
    } else {
      await fetch(`${url}/${ticketId}`, {
        method: 'GET',
      }).then(async (response) => {
        const ticketFull = await response.json();
        event.target.closest('.ticket').insertAdjacentHTML('beforeend',
          `<div class="desc">${ticketFull.description}</div>`);
      }).catch((err) => {
        console.error(err);
      });
    }
  }
});

// EDIT TICKET
modalEditTicket.addEventListener('click', async (event) => {
  event.preventDefault();
  if (event.target.classList.contains('submit_btn')) {
    const data = {
      name: nameInputEdit.value,
      description: descInputEdit.value,
    };
    await fetch(`${url}/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(data),
    }).then(() => {
      console.log('edit');
    }).catch((err) => {
      console.error(err);
    });

    modalEditTicket.reset();
    getData();
    modalEditTicket.classList.add('hidden');
  } else if (event.target.classList.contains('cancel_btn')) {
    modalEditTicket.classList.add('hidden');
  }
});

// DELETE TICKET
modalDelete.addEventListener('click', async (event) => {
  event.preventDefault();
  if (event.target.classList.contains('delete_btn')) {
    await fetch(`${url}/${ticketId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
    }).then(() => {
      console.log('removed');
    }).catch((err) => {
      console.error(err);
    });
    getData();
    modalDelete.classList.add('hidden');
  } else if (event.target.classList.contains('cancel_btn')) {
    modalDelete.classList.add('hidden');
  }
});

getData();
