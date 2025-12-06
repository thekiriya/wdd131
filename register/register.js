


let count = 1;


function participantTemplate(count) {
  return `
    <section class="participant${count}">
      <p>Participant ${count}</p>
      <div class="item">
        <label for="fname${count}"> First Name<span>*</span></label>
        <input id="fname${count}" type="text" name="fname${count}" value="" required />
      </div>
      <div class="item activities">
        <label for="activity${count}">Activity #<span>*</span></label>
        <input id="activity${count}" type="text" name="activity${count}" />
      </div>
      <div class="item">
        <label for="fee${count}">Fee ($)<span>*</span></label>
        <input id="fee${count}" type="number" name="fee${count}" />
      </div>
      <div class="item">
        <label for="date${count}">Desired Date <span>*</span></label>
        <input id="date${count}" type="date" name="date${count}" />
      </div>
      <div class="item">
        <p>Grade</p>
        <select>
          <option selected value="" disabled selected></option>
          <option value="1">1st</option>
          <option value="2">2nd</option>
          <option value="3">3rd</option>
          <option value="4">4th</option>
          <option value="5">5th</option>
          <option value="6">6th</option>
          <option value="7">7th</option>
          <option value="8">8th</option>
          <option value="9">9th</option>
          <option value="10">10th</option>
          <option value="11">11th</option>
          <option value="12">12th</option>
        </select>
      </div>
    </section>
  `;
}

// Add event listener to the Add Participant button
document.getElementById("add").addEventListener("click", function () {

  count++;

  const newParticipantHTML = participantTemplate(count);

  document.getElementById("add").insertAdjacentHTML("beforebegin", newParticipantHTML);
});

/* Step 4 & 5: Submit Form Planning & Implementation 
*/


function totalFees() {
  
  let feeElements = document.querySelectorAll("[id^=fee]");
  

  feeElements = [...feeElements];
  

  const total = feeElements.reduce((sum, input) => {
  
    return sum + (parseFloat(input.value) || 0);
  }, 0);
  
  return total;
}


function successTemplate(info) {
  return `
    Thank you <strong>${info.name}</strong> for registering. 
    You have registered <strong>${info.count}</strong> participants and owe <strong>$${info.total}</strong> in Fees.
  `;
}

// Main submit form handler
function submitForm(event) {

  event.preventDefault();


  const total = totalFees();


  const adultName = document.getElementById("adult_name").value;


  document.querySelector("form").style.display = "none";


  const summaryElement = document.getElementById("summary");
  

  const info = {
    name: adultName,
    count: count,
    total: total
  };

  summaryElement.innerHTML = successTemplate(info);
  

  summaryElement.style.display = "block";
}


document.querySelector("form").addEventListener("submit", submitForm);