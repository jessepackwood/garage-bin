const fetchItems = async () => {
  const unresolvedItems = await fetch('/api/v1/garage_items')
  const fetchedItems = await unresolvedItems.json()
  $('#garage-item-container').empty()

  $('.garage-count-total').text(fetchedItems.length)

  if ($('#garage-door').hasClass('hidden')) {
      $('#garage-item-container').prepend(`<h2>Current Items</h2><button class='sort-a'>Sort A-Z</button><button class='sort-z'>Sort Z-A</button>`)
      fetchedItems.forEach( item => appendFetchItem(item))
  
      $('#add-item').toggleClass('hidden')
  } else {
  $('#garage-item-container').empty()
  $('#add-item').toggleClass('hidden')
  }
}

const appendFetchItem = (item) => {
  $('#garage-item-container').append(
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
    const updatedOption = $(`#select-${item.id}`).val()
    patchCleanliness(item.id, updatedOption);
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
    throw error
  }
}

const dropdownOptions = (appendedOption) => {
  const options = ['sparkling', 'dusty', 'rancid']
  const filteredOptions = options.filter( option => option !== appendedOption)
  return filteredOptions
}

const renderItemData = (event) => {
  $(event.target).next().toggleClass('hidden')
}

const toggleGarage = () => {
  $('#garage-door').toggleClass('hidden')
}

const openGarage = async () => {
  toggleGarage();
  await fetchItems();
}

const addItem = async () => {
  const name = $('#name-input').val()
  const reason = $('#reason-input').val()
  const cleanliness = $('.dropdown').find(':selected').val()
  try {
  const itemPost = await fetch('/api/v1/garage_items', {
    method: 'POST',
    body: JSON.stringify({ name, reason, cleanliness }),
    headers: {
      'Content-type': 'application/json'
    }
  })
  const newItem = await itemPost.json()
  appendItem()
  $('.garage-count-total').text()
  } catch (error) {
  }
}

const appendItem = () => {
  const name = $('#name-input').val()
  const reason = $('#reason-input').val()
  const cleanliness = $('.dropdown').find(':selected').val()
  $('#garage-item-container').append(
    `<div>
        <h3 class='appended-item-name'>${name}</h3>
        <div class='hidden item-details'>
          <ul>
            <li>Reason: ${reason}</li>
            <li>Cleanliness: ${cleanliness}</li>
          </ul>
        </div>
      </div>`
    )
}

const appendSort = (item) => {
  $('#garage-item-container').append(
    `<h3 class='appended-item-name'>${item.name}</h3>
        <div id='item + ${item.id}' class='hidden item-details'>
          <ul>
            <li>Reason: ${item.reason}</li>
            <li>Cleanliness: ${item.cleanliness}</li>
          </ul>
        </div>
      </div>`
    )
}

const sortItems = () => {
  $('#garage-item-container').empty();
  $('#garage-item-container').append(`
    <h2>Current Items</h2>
    <div class='sort-buttons'>
        <button class='sort-a'>Sort A-Z</button>
        <button class='sort-z'>Sort Z-A</button>
      </div>`)
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
  $('#garage-item-container').empty();
  $('#garage-item-container').append(`
    <h2>Current Items</h2>
    <div class='sort-buttons'>
        <button class='sort-a'>Sort A-Z</button>
        <button class='sort-z'>Sort Z-A</button>
      </div>`)
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


$('.btn-add').on('click', addItem)
$('#btn-garage').on('click', openGarage)
$(document).on('click', '.sort-a', sortItems)
$(document).on('click', '.sort-z', sortItemsZ)
$(document).on('click', '.appended-item-name', renderItemData)


$(document).ready(() => {
})