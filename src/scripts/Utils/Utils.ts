export function randomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

export function randomElementFromArray<T>(array: T[]): T {
	return array[randomInt(array.length)];
}

export function shuffleArray<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function randomOnlineId(length = 4): string {
	let result = "";

	for (let i = 0; i < length; i++) {
		result += ALPHABET[randomInt(ALPHABET.length)];
	}

	return result;
} 