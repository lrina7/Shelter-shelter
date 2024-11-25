// Burger Menu
const burger = document.querySelector(".burger");
const menu = document.querySelector(".menu");
const overlay = document.querySelector(".overlay");
const body = document.body;
const html = document.documentElement;

burger.addEventListener("click", function () {
  this.classList.toggle("active");
  menu.classList.toggle("open");
  overlay.classList.toggle("active");
  body.classList.toggle("lock-scroll");
  html.classList.toggle("lock-scroll");
});

overlay.addEventListener("click", function () {
  menu.classList.remove("open");
  burger.classList.remove("active");
  overlay.classList.remove("active");
  body.classList.remove("lock-scroll");
  html.classList.remove("lock-scroll");
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", function () {
    menu.classList.remove("open");
    burger.classList.remove("active");
    overlay.classList.remove("active");
    body.classList.remove("lock-scroll");
    html.classList.remove("lock-scroll");
  });
});

// Slider Section
const slider = document.querySelector(".cards");
const prevButton = document.querySelector(".left");
const nextButton = document.querySelector(".right");
let petsData = [];
let currentSlide = [];
let previousSlides = [];
let nextSlides = [];
let cardsCount = getCardsCount();
let petInfo = [];
let animationDirection = "";

async function loadPetsData() {
  try {
    const response = await fetch("pets.json");
    petInfo = await response.json();
    petsData = mixArray([...petInfo]);

    if (petsData.length > 0) {
      generateUniqueSlide();
      renderCards();
    }
  } catch (error) {
    console.error("Ошибка загрузки данных: ", error);
  }
}

function mixArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateUniqueSlide() {
  const displayedPets = [
    ...currentSlide,
    ...previousSlides.flat(),
    ...nextSlides.flat(),
  ];

  let availablePets = petsData.filter((pet) => !displayedPets.includes(pet));

  if (availablePets.length < cardsCount) {
    petsData = mixArray([...petInfo]);
    previousSlides = [];
    nextSlides = [];
    availablePets = petsData.filter((pet) => !currentSlide.includes(pet));
  }

  currentSlide = availablePets.slice(0, cardsCount);
}

function renderCards() {
  slider.innerHTML = "";

  currentSlide.forEach((pet) => {
    const cardHTML = `
      <div class="card" data-id="${pet.id}">
        <img src="${pet.img}" alt="${pet.name}" class="slider__image">
        <p class="pet__name">${pet.name}</p>
        <button class="button__secondary">Learn more</button>
      </div>
    `;
    slider.insertAdjacentHTML("beforeend", cardHTML);
  });

  addCardListeners();
}

prevButton.addEventListener("click", () => {
  animationDirection = "left";
  slider.classList.add("slider__transition-left");

  if (previousSlides.length > 0) {
    nextSlides.unshift([...currentSlide]);
    currentSlide = previousSlides.pop();
  } else {
    generateUniqueSlide();
    nextSlides.unshift([...currentSlide]);
  }

  setTimeout(() => {
    renderCards();
    slider.classList.remove("slider__transition-left");
  }, 300);
});

nextButton.addEventListener("click", () => {
  animationDirection = "right";
  slider.classList.add("slider__transition-right");

  if (nextSlides.length > 0) {
    previousSlides.push([...currentSlide]);
    currentSlide = nextSlides.shift();
  } else {
    previousSlides.push([...currentSlide]);
    generateUniqueSlide();
  }

  setTimeout(() => {
    renderCards();
    slider.classList.remove("slider__transition-right");
  }, 300);
});

function getCardsCount() {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1280) return 3;
  if (screenWidth >= 768) return 2;
  return 1;
}

window.addEventListener("resize", () => {
  cardsCount = getCardsCount();
  renderCards();
});

window.addEventListener("load", loadPetsData);

// Modal Window
const modal = document.querySelector(".modal");

function openModal(pet) {
  modal.innerHTML = `
    <div class='modal__card'>
      <div class='modal__card__image'>
        <img class='modal__img' src="${pet.img}" alt='${pet.name}'>
      </div> 
      <div class='modal__card__content'>
        <h2 class='modal__pet__name'>${pet.name}</h2>
        <p class='modal__pet__breed'>${pet.type} - ${pet.breed}</p>
        <p class='modal__pet__description'>${pet.description}</p>
        <ul class='modal__pet__info'>
          <li class='modal__pet__age'><span><b>Age:</b> ${pet.age}</span></li>
          <li class='modal__pet__inoculation'><span><b>Inoculation:</b> ${pet.inoculations.join(
            ", "
          )}</span></li>
          <li class='modal__pet__diseases'><span><b>Diseases:</b> ${pet.diseases.join(
            ", "
          )}</span></li>
          <li class='modal__pet__parasites'><span><b>Parasites:</b> ${pet.parasites.join(
            ", "
          )}</span></li>
        </ul>
        <button class='modal__button__close' onclick="closeModal()">
          <img src='./images/Vector.png'>
        </button>
      </div>
    </div>
  `;
  modal.classList.add("modal__show");
  body.classList.add("lock-scroll");
  html.classList.add("lock-scroll");
}

function closeModal() {
  modal.classList.remove("modal__show");
  body.classList.remove("lock-scroll");
  html.classList.remove("lock-scroll");
}

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function addCardListeners() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const petId = card.getAttribute("data-id");
      const pet = petInfo.find((p) => p.id.toString() === petId);
      if (pet) {
        openModal(pet);
      }
    });
  });
}
