//variables

const services = [
  {
    id: 1,
    name: "Wed Design",
    price: 50,
  },
  {
    id: 2,
    name: "Web Development",
    price: 100,
  },
  {
    id: 3,
    name: "UI UX",
    price: 40,
  },
  {
    id: 4,
    name: "Graphic Design",
    price: 25,
  },
];

//Selectors

const app = document.getElementById("app");
const invoiceForm = document.getElementById("invoiceForm");
const selectService = document.getElementById("selectService");
const quantity = document.getElementById("quantity");
const serviceLists = document.getElementById("serviceLists");
const subTotal = document.getElementById("subTotal");
const tax = document.getElementById("tax");
const totalPrice = document.getElementById("totalPrice");
const table = document.getElementById("table");
const modalOwn = document.getElementById("modalOwn");
const openModal = document.getElementById("openModal");
const addNewServiceForm = document.getElementById("addNewServiceForm");
const closeModal = document.getElementById("closeModal");

//Bootstrap selector
const modalOwnBootstrap = new bootstrap.Modal("#modalOwn");

if (serviceLists.children.length == 0) {
  table.classList.add("d-none");
}

//Functions

const addingServiceToList = (service, quantity) => {
  const tr = document.createElement("tr");
  const total = service.price * quantity;
  tr.innerHTML = `
    <td class="d-flex justify-content-between align-items-center"><span>${service.name}</span><div class="dropdown">
  <i class="bi bi-three-dots-vertical" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    
  </i>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item delBtn" href="#">Delete</a></li>
      </ul>
    </div></td>
    <td class="text-end selectedQuantity" >${quantity}</td>
    <td class="text-end">$${service.price}</td>
    <td class="text-end">$<span class="selectedTotal">${total}</span></td>
  `;
  tr.setAttribute("service-id", service.id);
  return tr;
};

const calcSubTotal = () => {
  const pricesFromList = [...serviceLists.children];
  subTotal.innerText = pricesFromList.reduce(
    (pv, cv) => pv + parseFloat(cv.querySelector(".selectedTotal").innerText),
    0
  );
};

const calcTax = (dummyTax = 5) => {
  tax.innerText = parseFloat(subTotal.innerText) * (dummyTax / 100);
};

const calcTotal = () => {
  totalPrice.innerText =
    parseFloat(subTotal.innerText) + parseFloat(tax.innerText);
};

const invoiceFormSubmit = (event) => {
  event.preventDefault();
  table.classList.remove("d-none");
  const invoiceFormData = new FormData(event.target);
  const service = invoiceFormData.get("selectService");
  const quantity = invoiceFormData.get("quantity");

  //Finding out which product is selected

  const selectedService = services.find(
    (indiService) => indiService.id == service
  );

  alert("Thank you for your order");

  //Checking if the service is already existed
  const existingService = [...serviceLists.children].find(
    (list) => list.getAttribute("service-id") == selectedService.id
  );

  if (existingService) {
    const newQuantity = existingService.querySelector(".selectedQuantity");
    const newTotal = existingService.querySelector(".selectedTotal");

    //updating existed data

    newQuantity.innerText =
      parseFloat(newQuantity.innerText) + parseFloat(quantity);
    newTotal.innerText = selectedService.price * newQuantity.innerText;
  } else {
    //Adding service to list table

    serviceLists.append(addingServiceToList(selectedService, quantity));
  }

  //Calculating Subtotal

  calcSubTotal();

  //Calculating Tax

  calcTax();

  //Calculating total

  calcTotal();

  //reseting form

  invoiceForm.reset();
};

//Adding options to select box

services.forEach((service) => {
  selectService.add(new Option(service.name, service.id));
});

//Event Listeners

invoiceForm.addEventListener("submit", invoiceFormSubmit);

app.addEventListener("click", (event) => {
  if (event.target.classList.contains("delBtn")) {
    event.target.closest("tr").remove();
    calcSubTotal();
    calcTax();
    calcTotal();
    if (serviceLists.children.length == 0) {
      table.classList.add("d-none");
    }
  }
});

openModal.addEventListener("click", () => {
  modalOwnBootstrap.show();
});

closeModal.addEventListener("click", () => {
  modalOwnBootstrap.hide();
});

addNewServiceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const addNewServiceformData = new FormData(event.target);
  const newServiceName = addNewServiceformData.get("newServiceName");
  const newServicePrice = addNewServiceformData.get("newServicePrice");
  const id = Date.now();
  services.push({
    id,
    name: newServiceName,
    price: newServicePrice,
  });
  selectService.append(new Option(newServiceName, id));
  alert("New Service Added");
  modalOwnBootstrap.hide();

  addNewServiceForm.reset();
});
