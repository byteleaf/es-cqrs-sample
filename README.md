# Example of Event Sourcing with NestJS

## Introduction

Moderne Softwaresysteme stehen oft vor der Herausforderung, Daten konsistent zu verwalten und gleichzeitig eine hohe Skalierbarkeit und Nachvollziehbarkeit zu gewährleisten. Zwei Architekturmuster, die dabei helfen können, sind Event Sourcing und CQRS (Command Query Responsibility Segregation).

## Event Sourcing
Event Sourcing ist ein Architekturprinzip, bei dem der Zustand eines Systems nicht in Form von aktuellen Daten gespeichert wird, sondern als eine Sequenz von Ereignissen (Events). Jede Änderung wird als unveränderliches Event protokolliert, sodass der gesamte Verlauf eines Systems jederzeit nachvollziehbar bleibt.

Ein Beispiel aus einem Bibliothekssystem:

- BookRegistered → Ein neues Buch wird in den Bestand aufgenommen.
- BookBorrowed → Ein Leser leiht ein Buch aus.
- BookReturned → Ein Buch wird zurückgegeben.
- BookDamaged → Ein Buch wird als beschädigt markiert.
- BookRepaired → Ein beschädigtes Buch wurde repariert.
- BookRemoved → Das Buch wird aus dem System entfernt (Verlust oder Alter)

Jedes dieser Events beschreibt eine Veränderung im System. Um den aktuellen Zustand eines Buches zu ermitteln, werden alle relevanten Events in der Reihenfolge ihrer Entstehung angewendet.


![Event Sourcing Diagram](doc/png/event-sourcing.png)


### Projections

![Projection Diagram](doc/png/projection.png)

## CQRS
CQRS steht für Command Query Responsibility Segregation und ist ein Architekturmuster, bei dem die Verarbeitung von Befehlen (Commands) und Abfragen (Queries) getrennt wird. Befehle sind Änderungsanforderungen, die den Zustand des Systems verändern, während Abfragen Informationen aus dem System abrufen, ohne den Zustand zu verändern.



## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
