```ts
const name = "Amazon"

const response = await fetch(`https://business-primary-color-v2.vercel.app?name=${name}`)

const hex = await response.text()

console.log(`#${hex}`)
```
