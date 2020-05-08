// GLOBALS
// set the minimum and maximum number of tickets able to be purchased
const minTickets = 1;
const maxTickets = 3;
// set ticket cost
const costPerTicket = 5.00;
const ticketSurcharge = 0.50;

// to be initialized on DOMContentLoaded below
let timerSpan;
// initilaized under TIMER section below
let minutes;
let seconds;





// ADD EVENT LISTENER ON DOMContentLoaded TO GET TIMER SPAN, AND RESET BUTTON (TO ZERO OUT FEEDBACK)
window.addEventListener('DOMContentLoaded', () => {
  // assign timerSpan
  timerSpan = document.getElementById('timer');
  // get numTickets input
  const numTickets = document.getElementById('numTickets');
  // focus
  numTickets.focus();

  // addEventListener on reset button
  document.getElementById('reset').addEventListener('click', () => {
    // remove feedback, if any
    contactInformationFeedback(true, ['name', 'email']);
    // hide contactInformation
    displayContactInformation(false);
    // focus on numTickets input
    numTickets.focus();
  });
});






// TIMER
minutes = 10;
seconds = 0;

// set interval
let intervalID = setInterval(() => {
  // decrement seconds
  seconds--;

  // check for condition of '0:00'
  if (seconds === 0 && minutes === 0) {
    // update DOM
    timerSpan.innerText = '0:00';
    // clearInterval
    clearInterval(intervalID);
    // ensures DOM gets updated with '0:00' by adding the setTimeout callback to end of callback queue
    setTimeout(() => {
      // alert user
      alert('Sorry, your time to complete the form has expired! Please try again if you still wish to purchase tickets.');
      // refresh page
      location.href = location.href;
    }, 0);
  }

  // if the above condition is not met, and if seconds is -1 then update both minutes and seconds variables
  if (seconds === -1) {
    minutes--;
    seconds = 59;
  }

  // update DOM
  timerSpan.innerText = `${minutes}:${seconds >= 10 ? seconds : seconds.toString().padStart(2, '0')}`;
}, 1000);






// CALCULATE TOTAL
const calculateTotal = () => {
  // get input element
  const numTickets = document.getElementById('numTickets');
  // convert value to Number or NaN
  const value = Number(numTickets.value);

  // if user removes input
  if (numTickets.value === '') {
    // remove feedback
    numTicketsFeedback(true, numTickets);
    // update total cost to zero
    updateTotalCost(0);
    // hide contact information
    displayContactInformation(false);
    // focus
    numTickets.focus();
  }

  // if inapproprate value
  else if (value < minTickets || value > maxTickets || isNaN(value)) {
    // provide feedback
    numTicketsFeedback(false, numTickets);
    // update total cost to zero
    updateTotalCost(0);
    // hide contact information
    displayContactInformation(false);

  // otherwise
  } else {
    // remove feedback
    numTicketsFeedback(true, numTickets);
    // update totalCost input element
    updateTotalCost(value);
    // display contact information
    displayContactInformation(true);
  }
}


const numTicketsFeedback = (isWithinRange, numTickets) => {
  // get msgTickets span element
  const msgTickets = document.getElementById('msgTickets');

  // if number of tickets is valid or ''
  if (isWithinRange) {
    // remove feedback
    numTickets.style.backgroundColor = 'initial';
    msgTickets.innerText = '';

  // otherwise
  } else {
    // add feedback
    numTickets.style.backgroundColor = 'yellow';
    msgTickets.innerText = 'You can only buy between 1 and 3 tickets';
    // focus and select
    numTickets.focus();
    numTickets.select();
  }
};


const updateTotalCost = (qty) => {
  // calculate total
  const total = (qty * costPerTicket) + (qty * ticketSurcharge);
  // get totalCost input element
  const totalCost = document.getElementById('totalCost');

  // update totalCost input element
  totalCost.value = `$${total.toFixed(2)}`;

};


const displayContactInformation = (isWithinRange) => {
  // get contactInformation div element
  const contactInformation = document.getElementById('contactInformation');

  // if number of tickets is valid
  if (isWithinRange) {
    // show div
    contactInformation.style.display = 'block';
    // get name input and focus
    document.getElementById('name').focus();

  // otherwise
  } else {
    // hide div
    contactInformation.style.display = 'none';
  }
};






// COMPLETE PURCHASE
const completePurchase = (e) => {
  // prevent default
  e.preventDefault();

  // check if inputs are valid
  const nameIsValid = validateContactInformation('name');
  const emailIsValid = validateContactInformation('email');

  // if both are valid (true)
  if (nameIsValid && emailIsValid) {
    // remove feedback
    contactInformationFeedback(true, ['name', 'email']);
    // alert and refresh
    purchaseSuccess();
    // nothing follows
  }

  // if both are invalid (false)
  if (!nameIsValid && !emailIsValid) {
    // provide feedback for both
    contactInformationFeedback(false, ['name', 'email']);
  }

  // if only name is invalid
  else if (!nameIsValid) {
    // provide feedback for name
    contactInformationFeedback(false, ['name']);
    // remove feedback for email
    contactInformationFeedback(true, ['email']);
  }

  // if only email is invalid
  else if (!emailIsValid) {
    // provide feedback for email
    contactInformationFeedback(false, ['email']);
    // remove feedback for name
    contactInformationFeedback(true, ['name']);
  }
};


const validateContactInformation = (inputElementID) => {
  // get contact input element value
  const userInput = document.getElementById(inputElementID).value;

  // if input has id of 'name'
  if (inputElementID === 'name') {
    // if valid return true (maxLength handled by HTML)
    if (/([A-Za-z\- ])+/.test(userInput)) return true;
    // otherwise return false
    else return false;

  // if input has id of 'email'
  } else if (inputElementID === 'email') {
    // if valid (maxLength handled by HTML)
    if (/^[a-zA-Z0-9._%+-]{1,}@[a-zA-Z0-9.-]{1,}\.[a-zA-Z]{2,3}$/.test(userInput)) return true;
    // otherwise return false
    else return false;
  }
};


const contactInformationFeedback = (isValid, input) => {
  // if valid
  if (isValid) {
    // iterate over array, remove background-color, and reset span innerText
    input.forEach(id => {
      document.getElementById(id).style.backgroundColor = 'initial';
      document.getElementById(`msg${id}`).innerText = '';
    });

  // otherwise
  } else {
    // iterate over array, change background-color, and add innerText to span
    input.forEach(id => {
      document.getElementById(id).style.backgroundColor = 'yellow';
      document.getElementById(`msg${id}`).innerText = `Please include your ${id} to purchase tickets`;
    });
  }
};


const purchaseSuccess = () => {
  // clear interval
  clearInterval(intervalID);
  // get total cost value
  const totalCost = document.getElementById('totalCost').value;

  // ensures DOM gets updated (with user feedback removal) by adding the setTimeout callback to end of callback queue
  setTimeout(() => {
    alert(`
    Thank you for your purchase
    Your total cost is ${totalCost}
    Please allow 24 hours for electronic delivery`);

    // refresh
    location.href = location.href;
  }, 0);

  // get form
  const form = document.getElementsByTagName('form')[0];
  form.submit();
};