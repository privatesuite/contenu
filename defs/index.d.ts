// import Database from "../src/db";

declare module "contenu" {

	const database: import("../src/db");

	const User = (await import("../src/db/user")).default;
	const Element = (await import("../src/db/element")).default;
	const Template = (await import("../src/db/template")).default;

	namespace routes {

		const api: import("router");
		const data: import("router");
		const admin: import("router");

	}

	namespace tools {

		const wp_migrate = (await import("../src/tools/wp_migrate")).default;

	}

	namespace utils {

		const body = (await import("../src/utils/body")).default;
		const clone = (await import("../src/utils/clone")).default;
		const conf = (await import("../src/utils/conf")).default;
		const cookies = (await import("../src/utils/cookies")).default;
		const session = (await import("../src/utils/session")).default;
		const view = (await import("../src/utils/view")).default;

	}

}
