'use server';

/**
 * All functions here are server actions and can be used on client or server components.
 */

import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { redirect } from 'next/navigation';
import { getBooking } from './data-service';
import { gu } from 'date-fns/locale';

export async function signInAction() {
	return await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
	return await signOut({ redirectTo: '/' });
}

export async function updateGuest(formData) {
	const session = await auth();

	if (!session?.user?.guestId) {
		throw new Error('User is not authenticated');
	}

	// prepare values
	const nationalID = formData.get('nationalID');
	const [nationality, countryFlag] = formData.get('nationality').split('%');

	// validate national ID number (for demo purposes, we just check if it's alphanumeric and between 6 and 12 characters)
	if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
		throw new Error('Please provide a valid National ID');
	}

	// we convert the formData to an object and pass it to our data service function
	const updatedFields = {
		nationalID,
		nationality,
		countryFlag,
	};

	// perform supabase update
	const { error } = await supabase
		.from('guests')
		.update(updatedFields)
		.eq('id', session.user.guestId);

	if (error) {
		throw new Error('Guest could not be updated');
	}

	// revalidate cache for the guest profile page to reflect the updated data immediately
	revalidatePath('/account/profile');
}

export async function createReservation(bookingData, formData) {
	const session = await auth();

	if (!session?.user?.guestId) {
		throw new Error('User is not authenticated');
	}

	// for additional security, we may also validate the booking data on the server side before creating the booking
	// for validation, we may check "zod"
	const newBooking = {
		...bookingData,
		guestId: session.user.guestId,
		numGuests: Number(formData.get('numGuests')),
		observations: formData.get('observations').slice(0, 1000), // limit observations to 1000 characters
		extrasPrice: 0,
		totalPrice: bookingData.cabinPrice, // for simplicity, we don't have any extras in this demo,
		isPaid: false,
		hasBreakfast: false,
		status: 'unconfirmed',
	};

	const { error } = await supabase.from('bookings').insert([newBooking]);

	if (error) {
		throw new Error('Booking could not be created');
	}

	revalidatePath(`/cabins/${bookingData.cabinId}`);
	revalidatePath('/account/reservations');

	redirect('/cabins/thankyou');
}

export async function updateReservation(bookingId, formData) {
	const session = await auth();

	if (!session?.user?.guestId) {
		throw new Error('User is not authenticated');
	}

	// get booking details to get cabin's max capacity
	const booking = await getBooking(bookingId);
	if (!booking) {
		throw new Error('Reservation not found.');
	}

	const numGuests = formData.get('numGuests');
	if (
		!numGuests ||
		isNaN(numGuests) ||
		numGuests < 1 ||
		numGuests > booking.cabins.maxCapacity
	) {
		throw new Error('Please provide a valid number of guests');
	}

	const updatedFields = {
		numGuests,
		observations: formData.get('observations').slice(0, 1000),
	};

	const { error } = await supabase
		.from('bookings')
		.update(updatedFields)
		.eq('id', bookingId)
		.eq('guestId', session.user.guestId);

	if (error) {
		console.error(error);
		throw new Error('Booking could not be updated');
	}

	// revalidate cache for the reservations page to reflect the updated reservation immediately
	revalidatePath('/account/reservations');
	revalidatePath(`/account/reservations/edit/${bookingId}`);

	// redirect to reservations
	redirect('/account/reservations');
}

export async function deleteReservation(bookingId) {
	const session = await auth();
	if (!session?.user?.guestId) {
		throw new Error('User is not authenticated');
	}

	const { error } = await supabase
		.from('bookings')
		.delete()
		.eq('id', bookingId)
		.eq('guestId', session.user.guestId);

	if (error) {
		throw new Error('Booking could not be deleted');
	}

	// revalidate cache for the reservations page to reflect the deleted reservation immediately
	revalidatePath('/account/reservations');
}
