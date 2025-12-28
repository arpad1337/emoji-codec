/**
 * EmojiCodec - Robust obfuscation using a Caesar-shifted Emoji mapping.
 * Optimized to prevent URI errors and memory crashes in Docker environments.
 */
export class EmojiCodec {
  private readonly EMOJI_ALPHABET = [
    "🚀", "🌈", "🔥", "💎", "🍦", "🎈", "🍀", "🌟", "🐱", "🐶", 
    "🍎", "🍌", "🍕", "🍔", "🍟", "🍣", "🍭", "🍩", "🍪", "🍺", 
    "🍷", "🍹", "⚽", "🎮", "🎸", "🎬", "🚗", "🚲", "🏠", "🏢", 
    "⌚", "📱", "💻", "💡", "🔑", "🔒", "⚡", "🌀", "🎭", "🎨", 
    "🎤", "🎧", "🦄", "🐉", "🌵", "🌴", "🌙", "🌍", "🪐", "👻", 
    "🤖", "👽", "👾", "👑", "👔", "💄", "🎩", "🎒", "👟", "🌻", 
    "🌲", "🌊", "🌋", "🎁"
  ];

  private readonly shuffledB64: string;

  /**
   * @param shuffledB64 - A 64-character shuffled Base64URL string.
   */
  constructor(shuffledB64: string) {
    if (shuffledB64.length !== 64) {
      throw new Error("EmojiCodec: shuffledB64 must be exactly 64 characters.");
    }
    this.shuffledB64 = shuffledB64;
  }

  /**
   * Generates a new random 64-character Base64URL alphabet.
   * Run this once and save the output to your environment variables.
   */
  public static generateShuffled(): string {
    const standardB64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    const arr = standardB64.split("");
    
    // Fisher-Yates Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    return arr.join("");
  }

  /**
   * Shuffles object keys to ensure identical data produces different outputs.
   */
  private shuffleObject(obj: Record<string, any>): Record<string, any> {
    const keys = Object.keys(obj);
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    const shuffled: Record<string, any> = {};
    keys.forEach((key) => (shuffled[key] = obj[key]));
    return shuffled;
  }

  public encode(data: object): string {
    const payload = {
      ...data,
      ts: Date.now(),
      cid: typeof crypto !== 'undefined' ? crypto.randomUUID().split('-')[0] : Math.random().toString(36).substring(7)
    };

    const json = JSON.stringify(this.shuffleObject(payload));

    const b64 = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) => 
      String.fromCharCode(parseInt(p1, 16))
    )).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    const keyIndex = Math.floor(Math.random() * 64);
    const keyEmoji = this.EMOJI_ALPHABET[keyIndex];

    const shifted = b64.split("").map(char => {
      const idx = this.shuffledB64.indexOf(char);
      return idx === -1 ? char : this.EMOJI_ALPHABET[(idx + keyIndex) % 64];
    }).join("");

    return keyEmoji + shifted;
  }

  public decode(emojiString: string): Record<string, any> {
    try {
      const emojiArray = [...emojiString];
      const keyEmoji = emojiArray[0];
      const dataEmojis = emojiArray.slice(1);

      const keyIndex = this.EMOJI_ALPHABET.indexOf(keyEmoji);
      if (keyIndex === -1) throw new Error("Invalid Key Emoji");

      const b64 = dataEmojis.map((emoji) => {
        const emojiIdx = this.EMOJI_ALPHABET.indexOf(emoji);
        if (emojiIdx === -1) return ""; 
        const originalIdx = (emojiIdx - keyIndex + 64) % 64;
        return this.shuffledB64[originalIdx];
      }).join("");

      const standardB64 = b64.replace(/-/g, "+").replace(/_/g, "/");
      const rawText = typeof Buffer !== 'undefined' 
        ? Buffer.from(standardB64, 'base64').toString('utf8')
        : decodeURIComponent(atob(standardB64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

      return JSON.parse(decodeURIComponent(rawText));
    } catch (err: any) {
      throw new Error(`EmojiCodec Corruption: ${err.message}`);
    }
  }
}
