# Emoji-Codec
Encoding and decoding JSON messages with emojis: CSRF-proof, Caesar shifting, object shuffling

![Screen shot](https://raw.githubusercontent.com/arpad1337/emoji-codec/refs/heads/main/Screenshot%202025-12-31%20at%2007.26.06.png)

## Whitepaper

[THE EMOJI-CODEC PROTOCOL: A COMPREHENSIVE ANALYSIS OF
ALGORITHMIC COMPLEXITY, TELEMETRY OBFUSCATION, AND
CRYPTOGRAPHIC VIABILITY](https://www.arpi.im/emoji-codec.pdf)

## Usage

```typescript

// 1. Get your unique key
const myNewKey = EmojiCodec.generateShuffled();
console.log("Save this to your .env:", myNewKey);

...

// 2. Instantiate the codec
const codec = new EmojiCodec(myNewKey);

...

// 3. Use it
const payload = { event: "purchase", amount: 49.99 };
const encoded = codec.encode(payload); 
// Output: 🚀🍕🌈🍦🔥... (changes every time due to random key + shuffleObject)

...

const decoded = codec.decode(encoded);
console.log(decoded);

```

## Author

Arpad Kish <arpad@greeneyes.ai>

## License

MIT



