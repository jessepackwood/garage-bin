const fetchItems = async () => {
  const unresolvedItems = await fetch('/api/v1/garage_items');
  const fetchedItems = await unresolvedItems.json();
  $('.current-items').empty();
  $('.garage-count-total').text(fetchedItems.length);

  let sparkleCount = 0;
  let dustyCount = 0;
  let rancidCount = 0;

  fetchedItems.forEach( item => {
    appendFetchItem(item);

    if (item.cleanliness === 'sparkling') {
      sparkleCount += 1
    }
    else if (item.cleanliness === 'dusty') {
      dustyCount += 1
    }
    else if (item.cleanliness === 'rancid') {
      rancidCount += 1
    }

    $('.sparkling-count-total').text(sparkleCount);
    $('.dusty-count-total').text(dustyCount);
    $('.rancid-count-total').text(rancidCount);
  })
}

const appendFetchItem = (item) => {
  $('.current-items').append(
      `<div>
        <h3 class='appended-item-name'>${item.name}</h3>
        <div id='item-${item.id}' class='hidden item-details'>
          <ul>
            <li>Reason: ${item.reason}</li>
            <li>Cleanliness: 
              <select id='select-${item.id}'>
                <option>${item.cleanliness}</option>
                <option>${dropdownOptions(item.cleanliness)[0]}</option>
                <option>${dropdownOptions(item.cleanliness)[1]}</option>
              </select>
            </li>
          </ul>
        </div>
      </div>`
    )
  $(`#select-${item.id}`).on('change', () => {
    const updatedOption = $(`#select-${item.id}`).val();
    patchCleanliness(item.id, updatedOption);
    fetchItems();
  });
}

const patchCleanliness = async (id, updatedOption) => {
  try {
  await fetch(`/api/v1/garage_items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ cleanliness: updatedOption }),
    headers: {
      'Content-type': 'application/json',
    }
  })
  } catch (error) {
    throw error;
  }
}

const dropdownOptions = (appendedOption) => {
  const options = ['sparkling', 'dusty', 'rancid'];
  const filteredOptions = options.filter( option => option !== appendedOption);
  return filteredOptions;
}

const renderItemData = (event) => {
  $(event.target).next().toggleClass('hidden');
}

const toggleGarage = () => {
  $('#garage-door').toggleClass('hidden');
}

const openGarage = async () => {
  toggleGarage();
  await fetchItems();
}

const addItem = async () => {
  const name = $('#name-input').val();
  const reason = $('#reason-input').val();
  const cleanliness = $('.dropdown').find(':selected').val();
  try {
  const itemPost = await fetch('/api/v1/garage_items', {
    method: 'POST',
    body: JSON.stringify({ name, reason, cleanliness }),
    headers: {
      'Content-type': 'application/json'
    }
  })
  const newItem = await itemPost.json();
  } catch (error) {
  }
  $('#name-input').val('');
  $('#reason-input').val('');
  fetchItems();
}

const appendSort = (item) => {
  $('.current-items').append(
    `<h3 class='appended-item-name'>${item.name}</h3>
        <div id='item + ${item.id}' class='hidden item-details'>
          <ul>
            <li>Reason: ${item.reason}</li>
            <li>Cleanliness: 
            <select id='select-${item.id}'>
                <option>${item.cleanliness}</option>
                <option>${dropdownOptions(item.cleanliness)[0]}</option>
                <option>${dropdownOptions(item.cleanliness)[1]}</option>
              </select></li>
          </ul>
        </div>
      </div>`
    )
}

const sortItems = () => {
  $('.current-items').empty();
  fetch('/api/v1/garage_items')
    .then(response => response.json())
    .then((items) => {
      const sortedItems = items.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      sortedItems.forEach((item) => {
        appendSort(item)
      });
    });
};

const sortItemsZ = () => {
  $('.current-items').empty();
  fetch('/api/v1/garage_items')
    .then(response => response.json())
    .then((items) => {
      const sortedItems = items.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
        if (nameB < nameA) {
          return -1;
        }
        if (nameB > nameA) {
          return 1;
        }
        return 0;
      });
      sortedItems.forEach((item) => {
        appendSort(item)
      });
    });
}


$('.btn-add').on('click', addItem);
$('#btn-garage').on('click', openGarage);
$(document).on('click', '.sort-a', sortItems);
$(document).on('click', '.sort-z', sortItemsZ);
$(document).on('click', '.appended-item-name', renderItemData);
