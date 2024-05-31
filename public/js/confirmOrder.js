const stripe = Stripe('pk_test_51PJMer00K9SfgrcVbWAtcleHZcyIHsnEZmyKZvWUTSYQdby0BDZAjYkfRqqUQxyJ8kAj7GkNzC02DMc54GdvMYJk00QVvA4ovV');
const elements = stripe.elements();

// This is the card that users see on the page
const card = elements.create('card', {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  },
  hidePostalCode: true // Hide the default postal code field provided by Stripe
});
card.mount('#card-element');

// This handles the error based on the changes to the values of the card.
card.on('change', (event) => {
  const displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// When user clicks submit:
document.getElementById('order-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const street = document.getElementById('street').value;
  const city = document.getElementById('city').value;
  const province = document.getElementById('province').value;
  const country = document.getElementById('country').value;
  const cardName = document.getElementById('card-name').value;
  const postal = document.getElementById('postal').value;
  const totalAmount = parseFloat(document.getElementById('totalPrice').getAttribute('data-total-amount')) * 100; // Convert to cents

  // Create the billing details
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: card,
    billing_details: {
      name: cardName,
      email: email,
      address: {
        postal_code: postal
      }
    }
  });

  if (error) {
    const displayError = document.getElementById('card-errors');
    displayError.textContent = error.message;
  }
  else { // if no error, finally, process the order.
    const response = await fetch('/placeOrder2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName, lastName, street, city, province, country, postal, cardName,
        paymentMethodId: paymentMethod.id,
        amount: totalAmount
      })
    });

    // Check if the response is a redirect
    if (response.redirected) {
      // Redirect the user to the URL specified by the server
      alert("Order is confirmed!");
      setTimeout(function () {
        window.location.href = response.url;
      }, 500);
    } else {
      // Handle error responses
      const data = await response.json();
      alert(data.message);
    }
  }
});