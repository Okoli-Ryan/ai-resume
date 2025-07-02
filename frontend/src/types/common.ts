export type BaseEntity = {
	id: string;
	createdAt: string | Date;
	updatedAt: string | Date;
};

export type Response<T> =
	| {
			success: true;
			message?: string;
			data: NonNullable<T>;
	  }
	| {
			success: false;
			message: string;
			response: null;
	  };

      export type EnhanceTypes = "Experience" | "Project"