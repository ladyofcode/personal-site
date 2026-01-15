import type { PageLoad } from './$types';

export const prerender = false;
export const ssr = false; // Client-side only for query param handling

const VALID_GUESTS: Record<string, { name: string; responded: boolean; response: string | null }> = {
	'tabs': { name: 'Tabs', responded: false, response: null },
	'adam-124wry2e': { name: 'Adam', responded: false, response: null },
	'sachi-o6lsvwqu': { name: 'Sachi', responded: false, response: null },
	'sophie-1wo2lpht': { name: 'Sophie', responded: false, response: null },
	'natalie-a5kwl27u': { name: 'Natalie', responded: false, response: null },
	'miles-rd37abru': { name: 'Miles', responded: false, response: null },
	'avery-s2msamkl': { name: 'Avery', responded: false, response: null },
	'darcy-3rd0bdw4': { name: 'Darcy', responded: false, response: null },
	'sahil-as5c4f4f': { name: 'Leuca', responded: false, response: null },
	'sam-tfwmg10j': { name: 'Sam', responded: false, response: null },
	'emma-anjd19vo': { name: 'Emma', responded: false, response: null },
	'zainab-20bsf2sm': { name: 'Zainab', responded: false, response: null },
	'mom-8w9los14': { name: 'Mom', responded: false, response: null }
};

export const load: PageLoad = async ({ url }) => {
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