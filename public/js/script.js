const fetchItems = async () => {
  const unresolvedItems = await fetch('/api/v1/garage_items')
  const fetchedItems = await unresolvedItems.json()
  $('#garage-item-container').empty()

  if ($('#garage-door').hasClass('hidden')) {
  fetchedItems.forEach( item => {
    $('#garage-item-container').append(
      `<div>
        <h3>${item.name}</h3>
        <div id='item + ${item.id}' class='hidden'>
          <ul>
            <li>Reason: ${item.reason}</li>
            <li>Cleanliness: ${item.cleanliness}</li>
          </ul>
        </div>
      </div>`
      )
  }) 
  } else {
  $('#garage-item-container').empty()
  }
}

const renderItemData = () => {

}

const toggleGarage = () => {
  console.log('toggle garage')
  $('#garage-door').toggleClass('hidden')
}

const openGarage = async () => {
  toggleGarage();
  await fetchItems();
}

$('#btn-garage').on('click', openGarage)


$(document).ready(() => {
})