🔥 LEVEL 3 — ELECTIONS, FAILOVER, RECOVERY, ROLLBACK (REAL INTERNALS)

MongoDB replica sets use a consensus mechanism very similar to RAFT, with MongoDB–specific modifications.

The full cycle has 6 major phases:

Health monitoring & heartbeat system

Detecting PRIMARY failure

Election trigger

Voting & election algorithm

Promotion of new PRIMARY

Recovery, rollback, and catch-up

You are going to understand EACH of these in-depth.

1️⃣ HEARTBEAT SYSTEM — THE DETECTIVE

Every node sends a heartbeat every 2 seconds:

PING → Are you alive?
Are you PRIMARY?
What is your oplog timestamp?


If node does not respond for 10 seconds (default electionTimeoutMS):

PRIMARY is considered DEAD


Notes:

Heartbeats are TCP-level

If network is slow → false failovers can happen (bad setups)

Heartbeat carries metadata like:

node state

config version

last oplog timestamp

current PRIMARY identity

2️⃣ DETECTING PRIMARY FAILURE

SECONDARIES keep checking:

Primary’s oplog timestamp

Heartbeat replies

Liveness

Connectivity

PRIMARY fails if:

Server crash

Process killed

OS hangs

Disk full

Network partition

High latency network

Machine power cut

SECONDARY sees:

No heartbeat from PRIMARY for 10 seconds


SECONDARY says:

PRIMARY is dead.
Time to start an election.

3️⃣ ELECTION TRIGGER — WHO TRIES FIRST?

When PRIMARY is dead:

SECONDARY with highest priority tries first

If priority is equal → best oplog timestamp wins

If both equal → lowest _id wins (tie breaker)

Node announces:

I want to be PRIMARY.
Vote for me.

4️⃣ VOTING SYSTEM — HOW THE NEW PRIMARY IS CHOSEN
Each node can vote YES, NO, or ABSTAIN.

To win election:

Node must get >50% of votes.


Replica set rules:

Max voting members = 7

Nodes with priority = 0 never become primary

Nodes behind in oplog cannot win

Hidden and delayed nodes cannot win

Arbiters vote but do not store data

Ties → new election round, possibly after random delay

✔ Vote Algorithm Flow (REAL INTERNAL LOGIC)

Node asks all voters:

Do you vote me PRIMARY?
term: 12
oplogTimestamp: 123456789


Other nodes respond with YES only if:

The candidate’s oplog is as fresh or fresher than theirs.

If candidate is behind:

NO (because data loss risk)


Candidate is allowed to be PRIMARY (priority > 0)

Candidate config version matches theirs

They themselves are not in RECOVERING state

Network is connected

If all checks pass:

YES


If node receives majority votes:

PROMOTED → PRIMARY
term += 1

🧠 IMPORTANT: Oplog timestamp decides the winner

This is CRITICAL:

MongoDB always promotes the node with the latest data.

This avoids data loss during failover.

Example:

PRIMARY (dead)
SECONDARY A (latest oplog)
SECONDARY B (slightly behind)


New PRIMARY = SECONDARY A.

SECONDARY B cannot become PRIMARY because:

It does not have latest writes

Promoting it would lose recent data

It will vote NO for itself

5️⃣ AFTER WINNER SELECTED → NEW PRIMARY PROMOTION

When candidate wins:

Updates internal state to PRIMARY

Publishes new term

Notifies all nodes in heartbeats:

I am the new PRIMARY


Switches to accepting writes

SECONDARIES update their sync source

All clients automatically redirect traffic to new PRIMARY

How clients know?

MongoDB driver handles:

primary discovery

topology updates

failover

connection pool refresh

This is automatic.

6️⃣ WHAT HAPPENS TO THE OLD PRIMARY WHEN IT COMES BACK?

This is extremely important.

When old PRIMARY comes back online:

It does NOT become PRIMARY again

It checks its oplog

Determines how far behind it is

Syncs missing entries from the current PRIMARY

Old PRIMARY becomes:

SECONDARY


It only becomes PRIMARY again in some future election.

7️⃣ ROLLBACK — WHEN TWO PRIMARY NODES EXIST TEMPORARILY

Yes, this CAN happen.

Rare but important.

Scenario:

PRIMARY gets isolated by network

Secondaries think it’s dead → elect new PRIMARY

Old PRIMARY still writes data (because it didn’t know it was isolated)

When network comes back, old PRIMARY must "rollback" its last writes

MongoDB ensures:

Divergent writes from old primary are rolled back

New primary’s oplog is the “source of truth”

Rollback happens in:

local.rollback


Very important for consistency.

8️⃣ FAILOVER FULL FLOW (VERY SIMPLE DIAGRAM)
1. PRIMARY dies
2. SECONDARY detects no heartbeat
3. Election starts
4. Nodes vote
5. Node with latest oplog wins
6. New PRIMARY promoted
7. Clients auto-switch to new PRIMARY
8. Old PRIMARY recovers → becomes SECONDARY


Zero downtime (usually 2–10 seconds).

9️⃣ FAILURE SCENARIOS (REAL ENGINEERING VIEW)
🔥 Scenario 1: PRIMARY crashes

Result: new PRIMARY elected within 10 seconds.

🔥 Scenario 2: PRIMARY network partition

PRIMARY thinks everyone else is dead → steps down.
SECONDARIES elect new PRIMARY.

🔥 Scenario 3: SECONDARY ahead of others

It becomes PRIMARY.

🔥 Scenario 4: SECONDARY far behind

Cannot become PRIMARY (oplog too old).

🔥 Scenario 5: No majority

Cluster becomes read-only until majority restores.

🧠 WHAT YOU MUST REMEMBER (CORE OF LEVEL 3)
✔ Majority wins

2/3
3/5
4/7

✔ Highest oplog timestamp wins

Data freshness is king.

✔ No two primaries at the same time

If it happens → rollback fixes split brain.

✔ Elections happen automatically

No manual intervention.

✔ Clients automatically reconnect

Thanks to MongoDB driver topology monitoring.

🧠 VISUAL SUMMARY OF LEVEL 3 (your brain should lock this in):
HEARTBEATS → detect failure
FAILURE → trigger election
CANDIDATES → ask for votes
VOTES → majority wins
WINNER → PRIMARY
OTHER NODES → secondary
CLIENTS → switch automatically
OLD PRIMARY → becomes secondary
ROLLOVER → fix inconsistent writes


THIS is MongoDB’s self-healing system.