const COHORT = "2407-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
    console.log(state.events);
  } catch (error) {
    console.error(error);
  }
}

function renderEvents() {
  const eventList = document.getElementById("events");
  if (!state.events.length) {
    eventList.innerHTML = "<li>No events.</li>";
    return;
  }

  const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <h2>${event.name}</h2>
       <div>${event.description}</div>
       <div>${event.date}</div>
       <div>${event.location}</div>
      `;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Event";
    deleteButton.addEventListener("click", () => deleteEvent(event.id));
    li.appendChild(deleteButton);
    return li;
  });
  eventList.replaceChildren(...eventCards);
}

async function render() {
  await getEvents();
  renderEvents();
}
render();

async function addEvent(event) {
  event.preventDefault();

  const addEventForm = document.getElementById("addEvent");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: new Date(addEventForm.date.value).toISOString(),
        location: addEventForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create artist");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    // const json = await response.json();
    // console.log(json);

    if (!response.ok) {
      throw new Error("Event could not be deleted");
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

document.getElementById("addEventButton").addEventListener("click", addEvent);
