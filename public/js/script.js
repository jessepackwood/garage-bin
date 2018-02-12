const fetchItems = async () => {
  console.log('fetch items')
  const unresolvedItems = await fetch('/api/v1/garage_items')
  const fetchedItems = await unresolvedItems.json()
  $('#garage-item-container').empty()
  // $('#add-item').toggleClass('hidden')

  if ($('#garage-door').hasClass('hidden')) {
  fetchedItems.forEach( item => {
    $('#garage-item-container').append(
      `<div>
        <h3 class='appended-item-name'>${item.name}</h3>
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
  // console.log($(event.target).next())
  // if ($(event.target).next().hasClass('item-details')) {
  // $(event.target).next().toggleClass('hidden')
  // }
  $(event.target).next().toggleClass('hidden')

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
  try {
  const itemPost = await fetch('/api/v1/garage_items', {
    method: 'POST',
    body: JSON.stringify({ name, reason, cleanliness }),
    headers: {
      'Content-type': 'application/json'
    }
  })
  const newItem = await itemPost.json()
  console.log(newItem)
  appendItem()
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


$('.btn-add').on('click', addItem)
$('#btn-garage').on('click', openGarage)
$(document).on('click', '.appended-item-name', renderItemData)


$(document).ready(() => {
})