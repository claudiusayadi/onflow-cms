export type FormState =
	| {
			message?: string;
			data: {
				email?: string;
				password?: string;
			};
			errors?: {
				email?: string[];
				password?: string[];
			};
	  }
	| undefined;
