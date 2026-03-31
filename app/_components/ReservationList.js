'use client';

import { useOptimistic } from 'react';
import ReservationCard from './ReservationCard';
import { deleteReservation } from '@/app/_lib/actions';

function ReservationList({ bookings }) {
	// this will help with the UI feeling more responsive by immediately removing the reservation from the list, without waiting for the server response. If the server request fails, the UI will roll back to the previous state.
	const [optimisticBookings, optimisticDelete] = useOptimistic(
		bookings,
		(currentBookings, bookingId) => {
			return currentBookings.filter(
				(booking) => booking.id !== bookingId,
			);
		},
	);

	async function handleDelete(bookingId) {
		// take note of this call as it is the one responsible for the optimistic UI update which is based on the callback on the useOptimistic above. It will immediately remove the reservation from the list.
		optimisticDelete(bookingId);
		await deleteReservation(bookingId);
	}

	return (
		<ul className="space-y-6">
			{optimisticBookings.map((booking) => (
				<ReservationCard
					booking={booking}
					key={booking.id}
					onDelete={handleDelete}
				/>
			))}
		</ul>
	);
}

export default ReservationList;
