# Cabby Texts

Hello and welcome to the Cabby Texts project. This project is a part of the Cabby project, which is an AI-based cabin crew announcements generator.

You can find more information about the Cabby [on the official website](https://www.flyingart.dev/cabby).

## Currently supported languages
- English (en)
- German (de)
- Spanish (es)
- French (fr)
- Italian (it)
- Portuguese (pt)
- Polish (pl)
- Turkish (tr)

Please feel free to add more languages by creating a pull request. The more languages we have, the better the service will be.

### Language selection algorithm

Cabby always puts English as the first language in the list. 

The second language is taken using the following algorithm:
- get origin airport country language
- get destination airport country language
- order them by predefined priority (subject to change)
- take the first language from the list
- combine it with English

## Basics

You can find all the texts used in the Cabby project here. They're located in the `texts.ts` file, together with the `Text` type definition. 

Please pay attention to the `Text` type definition, as it contains all the necessary information about the text, it's definition, and has some comments to help you understand the structure.

## Structure

Typical text structure looks like this:

```json
{
  ...,
  "texts": [
    {
      "en": "Ladies and gentlemen, we are starting our descent into {destinationCityName}. Please make sure that your seatbelt is fastened and your seat back and tray table are in the upright position. We will collect any remaining service items in a few minutes. Thank you.",
      "pl": "[Ladies and gentlemen, we are starting our descent into {destinationCityName}.] Prosimy o upewnienie się, że Państwa pasy są zapięte, a oparcie fotela i stolik są w pozycji pionowej. Wkrótce zbierzemy śmieci. Dziękujemy."
    }
  ]
}
```

### Variables

You can use one of the following variables in the text, by wrapping them in curly braces `{}`:

- **originCityName** - _example: "Warsaw"_
- **destinationCityName** - _example: "London"_
- **captainName** - _example: "John"_
- **airlineName** - _example: "Lufthansa"_
- **crewName** - _example: "Emily"_
- **aircraftEmergencyExistsCount** - _example: "6"_
- **flightTime** - _example: "2 hours and 30 minutes"_
- **destinationCityTemperature** - _example: "25"_
- **destinationCityWeatherHumanDescription** - _example: "sunny"_

### Translation

Some of the languages may have different declinations for specific words. For example, in Polish, we have different declinations for the word "Warsaw" depending on the context:

- Lot do **Warszaw-y**
- Lądownie w **Warszaw-ie**
- Nasza destynacja to **Warszaw-a**

This may apply to other words as well, for example airline names, cities, etc.

To avoid headaches, you can wrap such sentence **(in ENGLISH)** in square brackets `[]`. Such sentence will be sent to the translation service, and the translation will be used in the final text. AI based translation services are pretty good at handling such cases.

## Contact

If you have any questions, feel free to contact me at [Discord](https://discord.gg/pmAtpESgbH) or any other way you prefer. I'm always happy to help.
