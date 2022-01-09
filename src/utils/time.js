/**
 * return date in format DD/MM/YYYY
 *
 * @param {Date} date
 */
export function formatDate(date) {
	return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

/**
 * return the difference between two dates in the format "X jours, Y mois, Z ânées"
 *
 * @param {Date} date1
 * @param {Date} date2
 */
export function timeDiff(date1, date2) {
	let diff = Math.abs(date2.getTime() - date1.getTime());

	const years = Math.round(diff / (1000 * 3600 * 24 * 365));
	diff = diff % (1000 * 3600 * 24 * 365);

	const months = Math.round(diff / (1000 * 3600 * 24 * 30));
	diff = diff % (1000 * 3600 * 24 * 30);

	const days = Math.round(diff / (1000 * 3600 * 24));

	return (
		(days ? `${days} jours ` : "") +
		(months ? `${months} mois ` : "") +
		(years ? `${years} années ` : "")
	);
}
