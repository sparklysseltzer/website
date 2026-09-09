# Tone and voice

## Purpose and source

Sparklys sounds confident, playful, culturally aware and a little absurd, with enough self-awareness to laugh at its own performance. It talks to people directly, not like a corporate campaign. Humor should feel like an invitation into the joke.

This guide interprets three existing German brand texts supplied by the merchant on 2026-09-08: an awards announcement, a shipping email and the Maracuja product description. The excerpts below are reference copy, not new approved product claims or a mandate to reuse historical facts. Technical guidance stays in English; German quotations preserve the original brand voice.

## The voice

- **Confident, then self-aware.** Make a bold entrance, then gently puncture the boast. Let the brand be the butt of the joke rather than the customer.
- **Absurd detail, delivered straight.** A named ship or an unnecessarily elaborate ceremony is funnier than announcing how hilarious the brand is. Escalation works when the details remain concrete.
- **Warm and conversational.** Address the reader directly with German “du”. Sound like a person with taste and a sense of humor, not a sales funnel.
- **Sensory when describing the drink.** Evoke flavor, setting and occasion. Product understanding matters more than fitting in another joke.
- **Contemporary without forcing slang.** Occasional English phrasing is part of the supplied voice. Use it deliberately; do not attach “af” or trendy language to every interface label.

## Tone by context

| Context | Treatment |
| --- | --- |
| Brand stories, awards and campaigns | Room for self-deprecation, dramatic setups and a dry reversal. Keep the actual award attribution accurate. |
| Shipping emails | An unmistakable shipping update first; an optional extravagant fictional celebration around it. Tracking and order facts stay easy to find. |
| Product descriptions | Flavor and verified product information lead. Add atmosphere, confident adjectives and a restrained playful ending. |
| Cart recommendations | One short, friendly line with a wink. The product, price, variant and action should carry the interaction. Avoid long setups. |
| Buttons, prices, shipping rules and discounts | Brief, understandable and accurate. “Einpacken” is the approved playful add-to-cart label; amounts and eligibility remain literal. |
| Errors, availability and accessibility labels | Calm, direct and actionable. Do not turn a failed payment or unavailable product into a joke at the customer's expense. Accessible names must explain the action. |

## Supplied reference examples

### Awards: boast, attribution, deflation

> Der beste Hard Seltzer der Welt
>
> Zumindest laut der international bekanntesten Spirituosenzeitschrift «The Spirits Business». Wir wissen nicht, was wir damit anfangen sollen, aber wir dachten, wir lassen es dich wissen.

The supplied continuation plays with “Master” as the new “Gold”, renames the ratings “Super-Gut” and “Nur-Sehr-Gut”, and promises to improve to “Unglaublich-Fantastisch”. The useful pattern is a bold claim immediately qualified by attribution, followed by deliberately over-serious commentary on a silly ranking. Verify award facts before reusing the claim in a new context.

### Shipping: a mundane event becomes an epic

> Die Reise beginnt!
>
> Unser Orakel sagte deine Bestellung voraus. Dadurch hatten wir genügend Zeit, um deine Lieferung stilvoll zu inszenieren.

The merchant's email escalates into a giant customer-shaped balloon, orchestra, choir, dancers, acrobats and fire performers, then a ship christened “John”, a salute and fireworks. Its closing joke is that most of the workforce calls in sick the next day, while Sparklys is already looking forward to the next order's celebration.

The humor comes from treating an ordinary parcel as an absurdly important state occasion. The oracle, hacker, parade and ship are fictional storytelling, not descriptions of real personal-data handling or logistics. Do not reproduce the sample's specific shipping date as reusable copy, or present invented fulfillment events as operational facts.

### Maracuja: sensory and more serious

> Sparklys Hard Seltzer Maracuja bringt die Tropen zu dir nach Hause. Exotisch und fruchtig-süss, ohne aufdringlich zu sein.

> Sommer in einer Dose, eine Geschmacksexplosion unter Wasser.

> Sparklys Hard Seltzer Maracuja — simply zeitgeisty af.

The full supplied description combines tropical flavor, beach-party imagery, Swiss lake/mountain settings and confident sensual language. Its vegan, gluten-free, calorie and sugar statements are product-specific claims in the supplied example; this voice guide does not verify them or authorize transferring them to another product. This is the restrained end of the voice: atmosphere and personality without a comic story in every paragraph.

## Writing and implementation rules

Use Swiss German spelling in German copy, including “ss” instead of “ß”. Preserve natural phrasing rather than translating English jokes literally. English remains the source locale for reusable theme UI, with German in `locales/de.json`; merchant editorial text remains merchant-managed content.

Prefer one good joke to stacked exclamation marks, emojis and punchlines. Do not invent scarcity, savings, awards, health effects or shipping promises to make copy more entertaining. Alcohol copy must not encourage excessive consumption. Keep humor around factual commerce information rather than obscuring it.

Use CSS for uppercase presentation when requested, leaving translated source text readable in sentence case. A visually prominent phrase need not be a semantic heading: the cart recommendation introduction is a paragraph inside an accessibly named aside.

## Cart recommendation working copy

Currently selected: **“Die Sachen kannst du ignorieren, theoretisch. Wolltens nur mal zeigen.”**, centered and visually uppercase. English source: “You can ignore this stuff, in theory. Just wanted to show you.” The existing “Einpacken” action remains separate.

Alternative proposals, not yet approved for replacement:

- **“Dein Warenkorb hat noch Platz.”** Dry, direct and understated; the strongest starting point for this compact UI.
- **“Kommt auch gern mit.”** Gives the recommended products a small personality without a long joke.
- **“Noch ein bisschen fantastisch?”** Echoes the brand's exaggerated confidence.
- **“Die wollten auch noch mit.”** A slightly more playful personification of the recommendation cards.

Choose one short introduction. Do not rotate slogans or change approved copy automatically.
