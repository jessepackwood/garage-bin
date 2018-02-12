const fetchItems = async () => {
  console.log('fetch items')
  const unresolvedItems = await fetch('/api/v1/garage_items')
  const fetchedItems = await unresolvedItems.json()
  $('#garage-item-container').empty()

  if ($('#garage-door').hasClass('hidden')) {
  fetchedItems.forEach( item => {
    $('#garage-item-container').append(
      `<div>
        <h3>${item.name}</h3>
        <div id='item + ${item.id}' class='hidden item-details'>
          <ul>
            <li>Reason: ${item.reason}</li>
            <li>Cleanliness: ${item.cleanliness}</li>
          </ul>
        </div>
      </div>`
      )
  })
  $('#add-item').toggleClass('hidden')
  } else {
  $('#garage-item-container').empty()
  $('#add-item').toggleClass('hidden')
  }
}

// const updateItem = async (id, option) => {
//   await fetch('/api/v1/garage_items/${id}', {
//     method: 'PATCH',
//     headers: {
//       'Content-type': 'application/json',
//     }
//     body: JSON.stringify({ cleanliness: option})
//   })
// }

const renderItemData = (event) => {
  if ($(event.target).next().hasClass('item-details')) {
  $(event.target).next().toggleClass('hidden')
  }
}

const toggleGarage = () => {
  $('#garage-door').toggleClass('hidden')
  // $('#garage-door').slideToggle()

}

const openGarage = async () => {
  toggleGarage();
  await fetchItems();
}

const addItem = async () => {
  const name = $('#name-input').val()
  const reason = $('#reason-input').val()
  const cleanliness = $('.dropdown').find(':selected').val()
  console.log(cleanliness)
  try {
  const itemPost = await fetch('/api/v1/garage_items', {
    method: 'POST',
    body: JSON.stringify({ name, reason, cleanliness }),
    headers: {
      'Content-type': 'application/json'
    }
  })
  const newItem = await itemPost.json()
  return newItem
  } catch (error) {
  }
}

$('.btn-add').on('click', addItem)
$('#btn-garage').on('click', openGarage)
$(document).on('click', renderItemData)


$(document).ready(() => {
})