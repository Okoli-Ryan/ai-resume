export type BaseEntity = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
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
