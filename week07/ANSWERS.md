Answer in week07/ANSWERS.md, 2–4 sentences each.

1. Why does Booking have an eventId column but Event has no bookingIds column? Where is the “many” side of a 1-N relation stored?
   Booking has an eventId column because it is the foreign key that links each booking to one specific event. If Event had a bookingIds column, it would have to store an array or list of IDs, which relational databases don't do. In a 1-N relationship, the foreign key is always stored on the "many" side, which is the Booking table.

2. booked repeats information we could compute with COUNT and SUM over bookings. Why keep it, and what must the code do so it never becomes wrong?
   We keep the booked column to make reading faster so we don't have to calculate SUM or COUNT every time someone views an event. To keep it accurate, every time we create or delete a booking, we must update the booked count inside the same database transaction. The code should also use atomic operations like increment and decrement instead of manual math so nothing goes out of sync.

3. What is the difference between prisma migrate dev and prisma generate? Which one changes the database?
   prisma migrate dev creates and applies new SQL migration files to update the database schema so it matches schema.prisma. On the other hand, prisma generate only updates the local Prisma Client code and types in our project without touching the database. Therefore, only prisma migrate dev changes the database.

4. A page lists 20 events with their bookings. One version runs 1 query, another runs 21. Name the problem and show how include fixes it.
   This is called the N+1 query problem, where 1 query gets the 20 events and 20 extra queries are sent to fetch bookings for each event. We can fix this by adding include: { bookings: true } inside prisma.event.findMany(). This tells Prisma to fetch both events and their bookings together in one go instead of querying in a loop.

5. Two students book the last seat at the same moment. Explain step by step why the read-check-update version can sell two seats and why the conditional updateMany cannot.
   In the read-check-update version, both students read the database at the same time and see that 1 seat is left, so both pass the check and make an update, resulting in an overbooked event. But with conditional updateMany, the condition booked: { lte: capacity - seats } is checked directly inside the database update. The first student's update succeeds and takes the seat, which immediately makes the condition false for the second student, so 0 rows are updated and they get rejected.
