"use client";

import { useEventContext } from "@/components/events/EventContext";
import { api } from "@/lib/api";
import type { DragEvent } from "react";
import { useMemo, useState } from "react";

type Entrant = {
  id: string;
  name: string;
};

type Slot = {
  entrant: Entrant | null;
  label: string;
  isBye?: boolean;
  sourceMatchId?: string;
  sourceEntrants?: Entrant[];
};

type Match = {
  id: string;
  number: number;
  slotA: Slot;
  slotB: Slot;
  winner: Entrant | null;
  isBye: boolean;
};

type Round = {
  id: string;
  label: string;
  matches: Match[];
};

const NAME_POOL = [
  "Falcons",
  "Titans",
  "Orbit",
  "Nova",
  "Rangers",
  "Vortex",
  "Echo",
  "Inferno",
  "Cyclones",
  "Apex",
  "Raiders",
  "Storm",
  "Pulse",
  "Blaze",
  "Phantoms",
  "Hydra",
  "Velocity",
  "Comets",
  "Gladiators",
  "Onyx",
  "Sentinels",
  "Riptide",
  "Rebels",
  "Monarchs",
  "Altitude",
  "Frontier",
  "Phoenix",
  "Strikers",
  "Voyagers",
  "Drift",
  "Dynasty",
  "Breakers",
];

const CARD_HEIGHT_REM = 7;
const BASE_GAP_REM = 2;
const COLUMN_GAP_REM = 5;
const CONNECTOR_STUB_REM = COLUMN_GAP_REM / 2;

function parseSavedWinnerIds(value: string | undefined): Record<string, string> {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] =>
          typeof entry[0] === "string" && typeof entry[1] === "string",
      ),
    );
  } catch {
    return {};
  }
}

function getNextPowerOfTwo(value: number) {
  let size = 1;
  while (size < value) size *= 2;
  return size;
}

function getRoundLabel(roundIndex: number, rounds: number) {
  const remaining = rounds - roundIndex;

  if (remaining === 1) return "Final";
  if (remaining === 2) return "Semifinal";
  if (remaining === 3) return "Quarterfinal";
  return `Round ${roundIndex + 1}`;
}

function buildEntrants(eventId: number, title: string): Entrant[] {
  const normalizedTitle = title.trim() || "Event";
  const seed = normalizedTitle.split("").reduce((sum, char) => sum + char.charCodeAt(0), eventId);
  const sizeOptions = [6, 8, 12, 16, 24, 32];
  const entrantCount = sizeOptions[seed % sizeOptions.length];

  return Array.from({ length: entrantCount }, (_, index) => {
    const poolName = NAME_POOL[(seed + index) % NAME_POOL.length];
    return {
      id: `${eventId}-${index + 1}`,
      name: `${poolName} ${index + 1}`,
    };
  });
}

function buildRounds(entrants: Entrant[], selectedWinnerIds: Record<string, string>): Round[] {
  if (entrants.length < 2) return [];

  const bracketSize = getNextPowerOfTwo(entrants.length);
  const seededEntrants: Slot[] = [
    ...entrants.map((entrant) => ({
      entrant,
      label: entrant.name,
    })),
    ...Array.from({ length: bracketSize - entrants.length }, () => ({
      entrant: null,
      label: "Bye",
      isBye: true,
    })),
  ];
  const rounds: Round[] = [];
  let current = seededEntrants;
  let roundIndex = 0;
  const totalRounds = Math.log2(bracketSize);
  let matchNumber = 1;

  while (current.length > 1) {
    const matches: Match[] = [];
    const nextRound: Slot[] = [];

    for (let index = 0; index < current.length; index += 2) {
      const slotA = current[index];
      const slotB = current[index + 1];
      const hasEntrantA = Boolean(slotA?.entrant);
      const hasEntrantB = Boolean(slotB?.entrant);
      const matchId = `round-${roundIndex + 1}-match-${index / 2 + 1}`;
      const selectedWinnerId = selectedWinnerIds[matchId];
      const selectedWinner =
        [slotA.entrant, slotB.entrant].find((entrant) => entrant?.id === selectedWinnerId) ?? null;
      const hasRealBye = Boolean((hasEntrantA && slotB.isBye) || (hasEntrantB && slotA.isBye));
      const winner = hasEntrantA && hasEntrantB ? selectedWinner : hasRealBye ? slotA.entrant ?? slotB.entrant : null;

      matches.push({
        id: matchId,
        number: matchNumber,
        slotA,
        slotB,
        winner,
        isBye: hasRealBye,
      });

      nextRound.push({
        entrant: winner,
        label: winner ? winner.name : `Winner of Match ${matchNumber}`,
        sourceMatchId: matchId,
        sourceEntrants: [slotA.entrant, slotB.entrant].filter((entrant): entrant is Entrant => Boolean(entrant)),
      });
      matchNumber += 1;
    }

    rounds.push({
      id: `round-${roundIndex + 1}`,
      label: getRoundLabel(roundIndex, totalRounds),
      matches,
    });

    current = nextRound;
    roundIndex += 1;
  }

  return rounds;
}

function getRoundLayout(roundIndex: number) {
  const centerSpacingRem = (CARD_HEIGHT_REM + BASE_GAP_REM) * 2 ** roundIndex;
  const gapRem = centerSpacingRem - CARD_HEIGHT_REM;
  const marginTopRem = roundIndex === 0 ? 0 : centerSpacingRem / 2 - CARD_HEIGHT_REM / 2;

  return {
    gapRem,
    marginTopRem,
  };
}

function MatchCard({
  match,
  showLeftConnector,
  showRightConnector,
  onSelectWinner,
}: {
  match: Match;
  showLeftConnector: boolean;
  showRightConnector: boolean;
  onSelectWinner: (matchId: string, entrant: Entrant) => void;
}) {
  const canSelectWinner = Boolean(match.slotA.entrant && match.slotB.entrant);
  const matchEntrants = [match.slotA.entrant, match.slotB.entrant].filter(
    (entrant): entrant is Entrant => Boolean(entrant),
  );

  function handleDragStart(event: DragEvent<HTMLButtonElement>, entrant: Entrant) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-entrant-id", entrant.id);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (!canSelectWinner) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    if (!canSelectWinner) return;

    event.preventDefault();
    const entrantId = event.dataTransfer.getData("application/x-entrant-id");
    const droppedEntrant = matchEntrants.find((entrant) => entrant.id === entrantId);

    if (droppedEntrant) {
      onSelectWinner(match.id, droppedEntrant);
    }
  }

  function handleSlotDragOver(event: DragEvent<HTMLButtonElement>, slot: Slot) {
    if (canSelectWinner || slot.sourceMatchId) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }
  }

  function handleSlotDrop(event: DragEvent<HTMLButtonElement>, slot: Slot) {
    event.preventDefault();
    const entrantId = event.dataTransfer.getData("application/x-entrant-id");
    const sourceEntrant = slot.sourceEntrants?.find((entrant) => entrant.id === entrantId);
    const matchEntrant = matchEntrants.find((entrant) => entrant.id === entrantId);

    if (slot.sourceMatchId && sourceEntrant) {
      onSelectWinner(slot.sourceMatchId, sourceEntrant);
      return;
    }

    if (canSelectWinner && matchEntrant) {
      onSelectWinner(match.id, matchEntrant);
    }
  }

  return (
    <div
      className="relative h-28 w-64 rounded-2xl border border-border bg-bg-light shadow-[0_18px_45px_rgba(0,0,0,0.15)]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {showLeftConnector ? (
        <div
          className="pointer-events-none absolute top-1/2 h-px -translate-y-1/2 bg-border-muted"
          style={{ left: `${-CONNECTOR_STUB_REM}rem`, width: `${CONNECTOR_STUB_REM}rem` }}
        />
      ) : null}
      {showRightConnector ? (
        <div
          className="pointer-events-none absolute top-1/2 h-px -translate-y-1/2 bg-border-muted"
          style={{ right: `${-CONNECTOR_STUB_REM}rem`, width: `${CONNECTOR_STUB_REM}rem` }}
        />
      ) : null}

      <div className="flex h-full flex-col overflow-hidden rounded-2xl">
        {[match.slotA, match.slotB].map((slot, index) => (
          <button
            key={`${match.id}-${index}`}
            type="button"
            draggable={Boolean(slot.entrant && canSelectWinner)}
            disabled={!slot.entrant && !slot.sourceMatchId}
            onClick={() => {
              if (slot.entrant && canSelectWinner) {
                onSelectWinner(match.id, slot.entrant);
              }
            }}
            onDragStart={(event) => {
              if (slot.entrant) {
                handleDragStart(event, slot.entrant);
              }
            }}
            onDragOver={(event) => handleSlotDragOver(event, slot)}
            onDrop={(event) => handleSlotDrop(event, slot)}
            className={[
              "flex flex-1 items-center justify-between px-4 py-3 text-left text-sm transition",
              index === 0 ? "border-b border-border-muted" : "",
              (slot.entrant && canSelectWinner) || slot.sourceMatchId
                ? "cursor-pointer hover:bg-brand/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand"
                : "cursor-default",
            ].join(" ")}
          >
            <span className={slot.entrant ? "truncate text-text" : "truncate text-text-muted/70"}>
              {slot.entrant?.name ?? slot.label}
            </span>
            {match.winner?.id === slot.entrant?.id ? (
              <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                Advance
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {match.isBye ? (
        <div className="absolute right-3 top-3 rounded-full bg-brand/12 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
          Bye
        </div>
      ) : null}
    </div>
  );
}

function RoundColumn({
  round,
  roundIndex,
  totalRounds,
  onSelectWinner,
}: {
  round: Round;
  roundIndex: number;
  totalRounds: number;
  onSelectWinner: (matchId: string, entrant: Entrant) => void;
}) {
  const { gapRem, marginTopRem } = getRoundLayout(roundIndex);
  const isFinalRound = roundIndex === totalRounds - 1;

  return (
    <section key={round.id} className="min-w-64">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
          {round.label}
        </p>
        <p className="text-sm text-text-muted">
          {round.matches.length} {round.matches.length === 1 ? "match" : "matches"}
        </p>
      </div>

      <div
        className="flex flex-col"
        style={{
          gap: `${gapRem}rem`,
          marginTop: `${marginTopRem}rem`,
        }}
      >
        {round.matches.map((match, matchIndex) => (
          <div key={match.id} className="relative h-28 w-64">
            {!isFinalRound && matchIndex % 2 === 0 ? (
              <div
                className="pointer-events-none absolute w-px bg-border-muted"
                style={{
                  right: `${-CONNECTOR_STUB_REM}rem`,
                  top: "50%",
                  height: `${CARD_HEIGHT_REM + gapRem}rem`,
                }}
              />
            ) : null}

            <MatchCard
              match={match}
              showLeftConnector={roundIndex > 0}
              showRightConnector={!isFinalRound}
              onSelectWinner={onSelectWinner}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function EventBracket() {
  const { event, setEvent } = useEventContext();
  const [selectedWinnerIds, setSelectedWinnerIds] = useState<Record<string, string>>(() =>
    parseSavedWinnerIds(event?.bracketResults),
  );
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const entrants = useMemo(
    () => (event ? buildEntrants(event.id, event.title) : []),
    [event],
  );
  const rounds = useMemo(() => buildRounds(entrants, selectedWinnerIds), [entrants, selectedWinnerIds]);

  if (!event) return null;

  const bracketSize = getNextPowerOfTwo(entrants.length);
  const byeCount = bracketSize - entrants.length;
  const { marginTopRem: winnerMarginTopRem } = getRoundLayout(Math.max(rounds.length - 1, 0));
  const champion = rounds.at(-1)?.matches[0]?.winner ?? null;

  async function saveWinnerIds(nextWinnerIds: Record<string, string>) {
    if (!event) return;

    setSaveState("saving");
    try {
      const bracketResults = JSON.stringify(nextWinnerIds);
      await api.updateEvent(event.id, { bracketResults });
      setEvent({ ...event, bracketResults });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function selectWinner(matchId: string, entrant: Entrant) {
    setSelectedWinnerIds((current) => {
      const next = {
        ...current,
        [matchId]: entrant.id,
      };
      void saveWinnerIds(next);
      return next;
    });
  }

  return (
    <div className="overflow-hidden rounded-lg bg-bg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-muted bg-bg-dark px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-text">Tournament Bracket</h2>
          <p className="text-sm text-text-muted">
            {saveState === "saving"
              ? "Saving tournament result..."
              : saveState === "saved"
                ? "Tournament result saved."
                : saveState === "error"
                  ? "Could not save tournament result."
                  : "The layout expands automatically as the player count increases."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          <span className="rounded-full border border-border px-3 py-2">{entrants.length} players</span>
          <span className="rounded-full border border-border px-3 py-2">{rounds.length} rounds</span>
          <span className="rounded-full border border-border px-3 py-2">{byeCount} byes</span>
        </div>
      </div>

      <div className="overflow-x-auto p-6">
        <div className="flex min-w-max items-start pb-4" style={{ columnGap: `${COLUMN_GAP_REM}rem` }}>
          {rounds.map((round, roundIndex) => (
            <RoundColumn
              key={round.id}
              round={round}
              roundIndex={roundIndex}
              totalRounds={rounds.length}
              onSelectWinner={selectWinner}
            />
          ))}

          <section className="min-w-64">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">Winner</p>
              <p className="text-sm text-text-muted">{champion ? "Final result" : "Awaiting final result"}</p>
            </div>

            <div className="relative h-28 w-64" style={{ marginTop: `${winnerMarginTopRem}rem` }}>
              <div
                className="pointer-events-none absolute top-1/2 h-px -translate-y-1/2 bg-border-muted"
                style={{ left: `${-CONNECTOR_STUB_REM}rem`, width: `${CONNECTOR_STUB_REM}rem` }}
              />
              <div className="flex h-full items-center rounded-2xl border border-dashed border-brand/45 bg-bg-light px-5 py-4 text-sm text-text shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                {champion ? (
                  <span className="truncate font-semibold text-brand">{champion.name}</span>
                ) : (
                  "Champion will appear here when the final match is completed."
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
