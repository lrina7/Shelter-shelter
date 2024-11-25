// Бургер-меню
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

// Pagination
let petsData = [];
let fullPetArray = [];
let currentPage = 1;
let totalPages = getPageCount();
const cardsContainer = document.querySelector(".cards__container");
const paginationFirstBtn = document.getElementById("first");
const paginationPrevBtn = document.getElementById("prev");
const paginationNextBtn = document.getElementById("next");
const paginationLastBtn = document.getElementById("last");
const paginationCurrentSpan = document.getElementById("current");

async function loadPetsData() {
  try {
    const response = await fetch("pets.json");
    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }
    petsData = await response.json();
    generateFullPetArray();
    renderPage(currentPage);
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
}

function generateFullPetArray() {
  const tempArray = [];
  for (let i = 0; i < 6; i++) {
    tempArray.push(...shuffleArray([...petsData]));
  }
  fullPetArray = tempArray;
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getPageCount() {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1280) return 6;
  if (screenWidth >= 768) return 8;
  return 16;
}

function getCardsPerPage() {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1280) return 8;
  if (screenWidth >= 768) return 6;
  return 3;
}

function renderPage(pageNumber) {
  const cardsPerPage = getCardsPerPage();
  const start = (pageNumber - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const petsForPage = fullPetArray.slice(start, end);

  cardsContainer.innerHTML = "";

  petsForPage.forEach((pet) => {
    const cardHTML = `
      <div class="card" data-id="${pet.id}">
        <img src="${pet.img}" alt="${pet.name}">
        <p class="pet__name">${pet.name}</p>
        <button class="button__secondary">Learn more</button>
      </div>
    `;
    cardsContainer.insertAdjacentHTML("beforeend", cardHTML);
  });

  updatePaginationButtons();
  addCardListeners();
}

function updatePaginationButtons() {
  paginationCurrentSpan.textContent = currentPage;
  paginationFirstBtn.disabled = currentPage === 1;
  paginationPrevBtn.disabled = currentPage === 1;
  paginationNextBtn.disabled = currentPage === totalPages;
  paginationLastBtn.disabled = currentPage === totalPages;
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderPage(currentPage);
  }
}

paginationFirstBtn.addEventListener("click", () => goToPage(1));
paginationPrevBtn.addEventListener("click", () => goToPage(currentPage - 1));
paginationNextBtn.addEventListener("click", () => goToPage(currentPage + 1));
paginationLastBtn.addEventListener("click", () => goToPage(totalPages));

window.addEventListener("resize", () => {
  const oldCardsPerPage = getCardsPerPage();
  const newCardsPerPage = getCardsPerPage();

  if (newCardsPerPage !== oldCardsPerPage) {
    totalPages = getPageCount();

    currentPage = Math.min(
      Math.ceil((currentPage * oldCardsPerPage) / newCardsPerPage),
      totalPages
    );
    renderPage(currentPage);
  }
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
      const pet = fullPetArray.find((p) => p.id.toString() === petId);
      if (pet) {
        openModal(pet);
      }
    });
  });
}
