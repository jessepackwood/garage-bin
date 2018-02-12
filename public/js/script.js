const fetchItems = async () => {
  const unresolvedItems = await fetch('/api/v1/garage_items')
  const fetchedItems = await unresolvedItems.json()
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
}

const renderItemData = () => {

}

const toggleGarage = () => {
  $('#garage-door').toggleClass('hidden')
}



$('#btn-garage').on('click', toggleGarage)

$(document).ready(() => {
  fetchItems()
})