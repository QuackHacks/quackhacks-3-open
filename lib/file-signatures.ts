export async function hasAllowedFileSignature(file: File, mimeType: string): Promise<boolean> {
	const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

	if (mimeType === "application/pdf") {
		return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
	}

	if (mimeType === "application/msword") {
		return (
			bytes[0] === 0xd0 &&
			bytes[1] === 0xcf &&
			bytes[2] === 0x11 &&
			bytes[3] === 0xe0 &&
			bytes[4] === 0xa1 &&
			bytes[5] === 0xb1 &&
			bytes[6] === 0x1a &&
			bytes[7] === 0xe1
		);
	}

	if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
		return bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;
	}

	if (mimeType === "image/png") {
		return (
			bytes[0] === 0x89 &&
			bytes[1] === 0x50 &&
			bytes[2] === 0x4e &&
			bytes[3] === 0x47 &&
			bytes[4] === 0x0d &&
			bytes[5] === 0x0a &&
			bytes[6] === 0x1a &&
			bytes[7] === 0x0a
		);
	}

	if (mimeType === "image/jpeg") {
		return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
	}

	if (mimeType === "image/gif") {
		const header = String.fromCharCode(...bytes.slice(0, 6));
		return header === "GIF87a" || header === "GIF89a";
	}

	if (mimeType === "image/webp") {
		const riff = String.fromCharCode(...bytes.slice(0, 4));
		const webp = String.fromCharCode(...bytes.slice(8, 12));
		return riff === "RIFF" && webp === "WEBP";
	}

	return false;
}
