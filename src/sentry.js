import * as Sentry from "@sentry/node";

import * as Tracing from "@sentry/tracing";

Sentry.init({
	dsn: "https://0b455324b2e44e7199183a6e0835c840@o1049442.ingest.sentry.io/6030707",

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 0.25,
});
