import { unstable_noStore } from 'next/cache';
import { getCabins } from '@/app/_lib/data-service';
import CabinCard from '@/app/_components/CabinCard';

async function CabinList({ filter }) {
	// will make the component/page dynamic and not be cached
	unstable_noStore();

	// fetch cabins
	const cabins = await getCabins();

	if (!cabins.length) return null;

	let filteredCabins = [];
	if (filter === 'all') filteredCabins = cabins;
	if (filter === 'small')
		filteredCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
	if (filter === 'medium')
		filteredCabins = cabins.filter(
			(cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7,
		);
	if (filter === 'large')
		filteredCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);

	return (
		<div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
			{filteredCabins.map((cabin) => (
				<CabinCard cabin={cabin} key={cabin.id} />
			))}
		</div>
	);
}

export default CabinList;
