
Design Choices:

- I decided to implement a queue for the location sampling. The /locations endpoint only creates an event and pushes it into the queue. I was unsure about whether to create the location record in the db before or after pushing to the queue.
- I used POSTGIS for efficient geographical calculation.
- For each area entering, I start a new Log record with an entryTime. And after each leaving, I update the Log record with a leavingTime.
- I made sure I do not query in a loop.

Next steps:
- I could not write tests due to time constraint. Unit and integration tests can be added.
- We can add a buffer time before a user re-enter a previously entered area, or vice versa for leaving.

