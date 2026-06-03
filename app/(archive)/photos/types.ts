export type GalleryPhoto = {
	id: string;
	title: string;
	album?: string;
	width: number;
	height: number;
	aspectRatio: number;
	urls: {
		full: string;
		thumb480: string;
		thumb1200: string;
	};
};

export type GalleryManifest = {
	generatedAt: string;
	photoCount: number;
	photos: GalleryPhoto[];
};
