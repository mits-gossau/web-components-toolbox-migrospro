# JSON GENERATOR

[app.json-generator.com/hpINMz4yKYqK](https://app.json-generator.com/hpINMz4yKYqK)

[Get Data](https://api.json-generator.com/templates/hpINMz4yKYqK/data)

MigrosPro Personal access token: ojsdbk9lbwewfluj5ujth8kfr0ujzmkmzzgfw5fk

```javascript
{
  "products": JG.repeat(5, 10, {
    productDetail: {
        id: JG.objectId(),
          image: "https://placehold.co/400",
          name: JG.loremIpsum({units: 'words', count: 5}),
          estimatedPieceWeight: "350g 6.86/kg"
      },
      totalTcc: 2.4
  });
}
```
