const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let addToy = false
const toyCollectionDiv = document.querySelector('#toy-collection');
// YOUR CODE HERE

const toyCards = (toy) => {
    return `<div class="card" data-id=${toy.id}>
                <h2>${toy.name}</h2>
                <img src=${toy.image}class="toy-avatar" />
                <p data-likes=>${toy.likes} Likes </p>
                <button class="like-btn" data-likes=${toy.likes}>Like <3</button>
                <buton class="trash" data-delete>🗑 </button>
            </div>`
}

fetch('http://localhost:3000/toys')
.then(resp => resp.json())
.then(toysObj => toysObj.forEach(toy => {
    toyCollectionDiv.innerHTML += toyCards(toy)
})
)


addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
    toyForm.addEventListener('submit', (event) => {
        const name = event.target.name.value;
        const image = event.target.image.value;
        newToyFetch(name, image)
        .then(resp => resp.json())
        .then(toy => toyCards(toy))
    } )
  } else {
    toyForm.style.display = 'none'
  }
})

const newToyFetch = (name, image) => {
    return fetch('http://localhost:3000/toys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            image: image,
            likes: 0
        })
    })
}

const updateToyLikes = (toyId, likeCount) => {
    return fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            likes: parseInt(likeCount)+1
        })
    })
}

const deleteToy = (toyId) => {
    return fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
}

toyCollectionDiv.addEventListener('click', (event) => {
    if (event.target.innerText === 'Like <3') {
        const toyId = event.target.parentElement.dataset.id;
        const likeCount = event.target.dataset.likes
        updateToyLikes(toyId, likeCount)
        .then(resp => resp.json())
        .then(updatedlikes => {event.target.dataset.likes = updatedlikes.likes
        event.target.parentElement.querySelector('p').innerText = `${updatedlikes.likes} Likes`
        })
    } else if (event.target.classList.contains('trash')) {
        deleteToy(event.target.parentElement.dataset.id)
        .then(resp => resp.json())
        .then( () => event.target.parentElement.remove())
    }
})
