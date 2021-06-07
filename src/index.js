document.addEventListener('DOMContentLoaded', () => {
    const dogForm = document.querySelector("#dog-form");
    const buttons = document.querySelector("body > div > div:nth-child(3) > table > thead > tr");
    const tableBody = document.querySelector("#table-body");
    const dogsArea = document.querySelector("body > div > div:nth-child(3)");

    dogForm.addEventListener("submit", event => {
        event.preventDefault();
        if (event.target.id.value === undefined) {
            addDog(event);
        }
        else {
            updateDog(event);
        }
    })

    function getDogs() {
        fetch("http://localhost:3000/dogs")
        .then(resp => resp.json())
        .then(dogs => displayDogs(dogs))
    }

    getDogs();

    function displayDogs(dogs) {
        tableBody.innerHTML = "";
        dogs.forEach(dog => { 
            tableBody.innerHTML += `<tr><td>${dog.name}</td> 
            <td>${dog.breed}</td> 
            <td>${dog.sex}</td> 
            <td><button data-id="edit-dog" id="${dog.id}">Edit Dog</button></td></tr>`
        })
    }

    dogsArea.addEventListener("click", event => {
        if (event.target.dataset.id === "edit-dog") {
            const id = parseInt(event.target.id);
            getDog(id);
        }
    })

    function getDog(id) {
        fetch(`http://localhost:3000/dogs/${id}`)
        .then(resp => resp.json())
        .then(dog => changeDogInfo(dog))
    }

    function changeDogInfo(dog) {
        dogForm.name.value = dog.name;
        dogForm.breed.value = dog.breed;
        dogForm.sex.value = dog.sex;
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "id";
        input.value = dog.id;
        input.id = "dog-id"
        dogForm.appendChild(input);
    }

    function addDog(event) {
        const dogName = event.target.name.value;
        const dogBreed = event.target.breed.value;
        const dogSex = event.target.sex.value;

        dogData = {
            name: dogName,
            breed: dogBreed,
            sex: dogSex
        }

        options = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dogData)
        }

        fetch("http://localhost:3000/dogs", options)
        .then(resp => resp.json())
        .then(dog => {
            tableBody.innerHTML += `<tr><td>${dog.name}</td> 
            <td>${dog.breed}</td> 
            <td>${dog.sex}</td> 
            <td><button data-id="edit-dog" id="${dog.id}">Edit Dog</button></td></tr>`
        })
    }

    function updateDog(event) {
        const dogName = event.target.name.value;
        const dogBreed = event.target.breed.value;
        const dogSex = event.target.sex.value;
        const dogId = parseInt(event.target.id.value);
        dogForm.reset();
        document.querySelector("#dog-id").remove();

        dogData = {
            name: dogName,
            breed: dogBreed,
            sex: dogSex
        }

        options = {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dogData)
        }

        fetch(`http://localhost:3000/dogs/${dogId}`, options)
        .then(resp => resp.json())
        .then( () => getDogs())
    }

})