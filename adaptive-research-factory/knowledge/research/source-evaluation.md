# How to judge one source and plan which sources a question needs

Two jobs live here. First, judge a single source before its claim is recorded as evidence.
Second, say in the research plan which kinds of sources each research question needs, and what
would count against the hypothesis. The source-type names (official, marketplace, and so on)
are defined in `shared/source-quality.md`. Use those names; do not invent new ones here.

## The per-source checklist

Answer all six before you record a claim. Write the answers down; one line each is enough.

1. **Who published it, and why?** Name the publisher. Say what they gain if the reader believes
   the claim: a sale, a listing, a policy, clicks, a client.
2. **Is the method visible?** Look for how the number was made: sample size, what was counted,
   how it was collected. A figure with no method is an assertion.
3. **What date, and what period?** Record two dates: when it was published and what period the
   figure describes. "Published 2026, covers Q3 2024" is a 2024 figure.
4. **Primary or secondhand?** Primary means the source collected the data or made the
   decision. Secondhand means it quotes someone else. Follow the quote back to the origin
   and judge the origin.
5. **Conflict of interest?** Does the publisher sell, rent, lend or lobby in the thing being
   measured? A conflict does not make the claim false. It caps how far you trust it alone.
6. **Corroborated or lone?** Is there a second source that did not copy the first? Two pages
   repeating one press release are one source.

## From checklist to confidence

Confidence is HIGH, MEDIUM or LOW. Set it from the answers, using the weakest link.

- **HIGH**: primary, method visible, period matches the question, no conflict that touches the
  claim, and at least one independent source agrees or the source is an official dataset.
- **MEDIUM**: one weakness only. For example: method partly visible, or the period is close but
  not exact, or a mild conflict, or a credible source standing alone.
- **LOW**: two or more weaknesses, or any of these: no method, unknown date, secondhand with
  no origin found, a publisher who profits directly from the claim and nobody confirms it.

Rules that apply every time:

- A conflicted source cannot be HIGH unless a source with no conflict confirms it.
- An old period caps confidence at MEDIUM when the question is about the present.
- Never raise confidence because a claim sounds reasonable.
- Put the reason for the grade in the limitations field, naming the failed checklist items.
- LOW evidence may be recorded, but never as a settled fact. Label it as an unverified claim.

## How a plan names source types and disconfirming evidence

For each research question, the plan states four things, in this order.

1. **Evidence needed**: the kind of data that would answer it (counts, prices, rules, dates).
2. **Preferred source types**: two or three, taken from `shared/source-quality.md`, best first.
   Pick the type that is closest to the original data. Add a local or domain source when the
   question is about one place.
3. **Disconfirming evidence**: what would show the hypothesis is wrong, written as something
   findable. "Listings that stay unsold for a year" is findable. "Negative signs" is not.
4. **Where disconfirming evidence lives**: it is often held by a different type of source
   than the supporting evidence (a regulator, a critic, a buyer, a competitor). Name that
   type. A plan that only lists sources likely to agree is incomplete.

Rule of thumb: if every preferred source type shares one interest, add one that does not.

## Worked example

Question: how many apartments changed hands in Tbilisi last year, and at what price per
square metre? Two sources turn up. Figures below are illustrative.

**Source A: a broker's blog post.** "Tbilisi sales are booming, prices up 18 percent."

1. Publisher: a brokerage. It earns a commission on sales, so a hot market helps it.
2. Method: none shown. No sample, no definition of "price".
3. Date: undated post; period not stated.
4. Secondhand: cites "market data" with no link.
5. Conflict: yes, direct.
6. Lone: no other source repeats the 18 percent.

Result: LOW. Record it as an unverified claim, not a fact.

**Source B: geostat.ge, the national statistics office.** A published table of registered
property transactions and price indices.

1. Publisher: a statistics office, mandated to publish. No sales interest.
2. Method: defined in the release notes (registered transactions, stated base period).
3. Date: published this year, covers the previous year. Matches the question.
4. Primary: it compiles the data itself.
5. Conflict: none touching the claim.
6. Corroboration: the central bank's property index points the same way.

Result: HIGH. Limitations: registered prices can sit below real prices, so note it.

Use of the pair: lean on B for the number. Use A only as a lead, for example a district name
worth checking. If A's 18 percent is far above B, say so in the evidence and do not average them.

Plan line for this question: preferred source types are official statistics, then the central
bank, then marketplace listings as a cross-check. Disconfirming evidence is a price index that
is flat or falling over the same period, found in the official table and in listing archives.

## Common mistakes

- Grading the website instead of the claim. A strong publisher can print a weak number.
- Treating a nicely formatted chart as method.
- Counting copies as corroboration.
- Planning only for evidence that supports the hypothesis.
