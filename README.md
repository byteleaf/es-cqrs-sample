# Example of Event Sourcing with NestJS

## Introduction

Modern software systems often face the challenge of managing data consistently while ensuring a high level of scalability and traceability. Two architectural patterns that can help with this are event sourcing and CQRS (Command Query Responsibility Segregation).

## Event Sourcing (ES)

Event sourcing is an architectural principle in which the status of a system is not stored in the form of current data, but as a sequence of events. Every change is logged as an immutable event so that the entire history of a system can be traced at any time.

An example from a library system:

- BookRegistered → A new book is added to the system.
- BookBorrowed → A reader borrows a book.
- BookReturned → A book is returned.
- BookDamaged → A book is marked as damaged.
- BookRepaired → A damaged book has been repaired.
- BookRemoved → The book is removed from the system (loss or non-repairable).

Each of these events describes a change in the system. To determine the current status of a book, all relevant events are applied in the order in which they occur.


![Event Sourcing Diagram](doc/png/event-sourcing.png)

### Advantages:
- Traceability & historization: Every change is retained as an event.
- Reproducibility: The condition can be reconstructed at any time.
- Asynchronous processing: Events can be processed independently by different systems.
- Auditability: complete traceability of all system changes

### Disadvantages:
- Complexity: Implementation is more demanding than with classic CRUD approaches.
- Memory requirements: The number of stored events can increase significantly over time.
- Error correction: Incorrect events must be corrected by compensating events (e.g. adjusting entry) or special mechanisms.
- Performance during reconstruction: The current state must be calculated by applying all events, which can be inefficient if there are many events. (Projections and Snapshots can help here)

## Command Query Responsibility Segregation (CQRS)

Command Query Responsibility Segregation is an architectural pattern in which the processing of commands and queries is separated. Commands are change requests that change the state of the system, while queries retrieve information from the system without changing the state.


| Model | Description | Example       |
| --- | --- |---------------|
| Command Model | Processes commands, generates events and changes the state of the system. | Register book |
| Query Model | Used to efficiently provide data for read requests. | Get book |


![Projection Diagram](doc/png/cqrs.png)

### Advantages:
- The separation of read and write operations allows for better scalability and performance optimization.
- The models can be optimized for their respective tasks.
- The command and query parts can be implemented in different technologies.
- The command and query parts can be scaled differently. For example, if there are many more read requests than write requests.

### Disadvantages:
- The complexity of the system increases because the data must be synchronized between the command and query models.
- The system is more difficult to understand because it is not the classic CRUD standard architecture.
- Often more data bases are used (e.g Caching or read-optimized databases for the query model).


## Projections

A Projection is the read model built from events.
It represents the current state of something, derived by processing a stream of historical events.

- Think of it like a materialized view of your data.
- It is not stored in the event store (which only stores events). It can be an extra table in the same database as the events, but also a completely separate storage (SQL, NoSQL, Elasticsearch, Redis etc.) that is optimized for fast queries
- Projections are rebuildable at any time by replaying the event stream.


| Concept | Description                                                   | Example                      |
| ---  |---------------------------------------------------------------|------------------------------|
| Projection | A materialized view of state built from events (read model).  | Book State   (Table / Entry) |
| Projector | A component that (listens to events and) updates projections. | Book Projector (Code)        |

![Projection Diagram](doc/png/projection.png)


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


