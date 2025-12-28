# emoji-codec
Encoding and decoding JSON messages with emojis: CSRF-proof, Caesar shifting, object shuffling

## Usage

```typescript

// 1. Get your unique key
const myNewKey = EmojiCodec.generateShuffled();
console.log("Save this to your .env:", myNewKey);

...

// 2. Setup your app
// 2. Instantiate the codec
const codec = new EmojiCodec(myNewKey);

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



