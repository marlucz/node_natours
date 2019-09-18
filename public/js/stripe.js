/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe('pk_test_Zi6NQYuSHLD9enrCpdv9EPSS00quvOIXM0');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API endpoint
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
      // `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form + process + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
