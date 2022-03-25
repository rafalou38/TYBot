import Sentry from "@sentry/node";

export default function (config) {
	Sentry.init({
		dsn: config.dsn,
	});
}
