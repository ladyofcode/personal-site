import type { PageServerLoad } from './$types';

const VALID_GUESTS: Record<string, { name: string; responded: boolean; response: string | null }> = {
	'tabs': { name: 'Tabs', responded: false, response: null },
	'adam-12qwry2e': { name: 'Adam', responded: false, response: null },
	'sachi-o6ltnwqu': { name: 'Sachi', responded: false, response: null },
    'sophie-1wo2lpht': { name: 'Sophie', responded: false, response: null },
    'natalie-a5ysl27u': { name: 'Natalie', responded: false, response: null },
    'miles-rd37ppti': { name: 'Miles', responded: false, response: null },
    'avery-s2mskruv': { name: 'Avery', responded: false, response: null },
    'darcey-3rd0dsw4': { name: 'Darcey', responded: false, response: null },
    'sahil-kh5c4d4f': { name: 'Sahil', responded: false, response: null },
    'sam-tfcfk10j': { name: 'Sam', responded: false, response: null },
    'ray-terfk10j': { name: 'Ray', responded: false, response: null },
    'emma-aiqm19vo': { name: 'Emma', responded: false, response: null },
    'zainab-20jkg2sm': { name: 'Zainab', responded: false, response: null },
    'mom-8w9cvs14': { name: 'Mom', responded: false, response: null }
};

export const load: PageServerLoad = async ({ url }) => {
	const guestParam = url.searchParams.get('guest');

	if (!guestParam) {
		return { isValidGuest: false, guestName: null, guestCode: null };
	}

	const guest = VALID_GUESTS[guestParam.toLowerCase()];
	if (!guest) {
		return { isValidGuest: false, guestName: null, guestCode: null };
	}

	return {
		isValidGuest: true,
		guestName: guest.name,
		guestCode: guestParam.toLowerCase()
	};
};
