// Small tools for the two pictures that play over time: the "Your idea" card
// and the second step's window. Each picture is a function of the time since
// it started, worked out anew on every frame, so it can be stopped, resumed
// and started again from any point.

export type Ease = (t: number) => number;

export const linear: Ease = (t) => t;
// a slow start; a slow start and a slow end
export const in1: Ease = (t) => t * t;
export const inOut1: Ease = (t) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));
// the same, stronger
export const in2: Ease = (t) => t * t * t;
export const out2: Ease = (t) => 1 - (1 - t) ** 3;
export const inOut3: Ease = (t) => (t < 0.5 ? 8 * t ** 4 : 1 - 8 * (1 - t) ** 4);
// past the end by a little, then back: how a thing pops in
export const back =
  (over: number): Ease =>
  (t) => {
    const p = t - 1;
    return p * p * ((over + 1) * p + over) + 1;
  };

// where a value stands at time t, when it goes from `from` to `to`, starting at `start` and taking `time` (seconds)
export function go(t: number, start: number, time: number, from: number, to: number, ease: Ease = linear) {
  if (t <= start) return from;
  if (t >= start + time) return to;
  return from + (to - from) * ease((t - start) / time);
}

// show a part at a strength from 0 to 1; at 0 it is taken out of sight altogether
export function fade(el: HTMLElement, strength: number) {
  const o = Math.min(1, Math.max(0, strength));
  el.style.opacity = String(o);
  el.style.visibility = o === 0 ? 'hidden' : 'inherit';
}

// Put a part where it stands: moved down by `y` pixels, sideways by `shift`
// per cent of its own width, at a size of `sx` by `sy`. While the part is on
// its way (`moving`) the move is written in three dimensions, which gives it
// a layer of its own for as long as it travels; at rest it lies flat again.
export function place(el: HTMLElement, at: { y?: number; shift?: number; sx?: number; sy?: number }, moving = false) {
  const y = at.y ?? 0;
  const sx = at.sx ?? 1;
  const sy = at.sy ?? sx;
  let out = '';
  if (at.shift) out += `translate(${at.shift}%, 0%) `;
  if (moving) out += `translate3d(0px, ${y}px, 0px) `;
  else if (y !== 0) out += `translate(0px, ${y}px) `;
  if (sx !== 1 || sy !== 1) out += `scale(${sx}, ${sy})`;
  el.style.transform = out.trim() || 'translate(0px, 0px)';
}

// whether time t falls inside one of the given moves, each a start and a length in seconds
export function during(t: number, ...moves: [number, number][]) {
  return moves.some(([start, time]) => t > start && t < start + time);
}

// The list that is written over the notes sits in a frame that can scroll.
export type Sizes = { frame: number; all: number; list: number; tops: number[] };

export function sizes(frame: HTMLElement, list: HTMLElement, rows: HTMLElement[]): Sizes {
  return { frame: frame.clientHeight, all: frame.scrollHeight, list: list.offsetHeight, tops: rows.map((row) => row.offsetTop) };
}

// Write the list down to a share `e` (0 to 1) of the way. The writing line
// travels down the frame; from half way on the frame also scrolls, so that a
// list longer than its frame ends with its last row in view. Each row lights
// up as the line reaches it. Returns how far the line has travelled down the
// frame, which is where the "building" pill rides.
export function write(e: number, m: Sizes, frame: HTMLElement, list: HTMLElement, rows: HTMLElement[]) {
  const travel = e * Math.max(0, m.frame - (m.all - m.list));
  const scroll = (Math.max(0, e - 0.5) / 0.5) * Math.max(0, m.all - m.frame);
  frame.scrollTop = scroll;
  const line = travel + scroll;
  list.style.clipPath = `inset(0px 0px ${Math.max(0, m.list - line)}px 0px)`;
  rows.forEach((row, k) => {
    if (line >= m.tops[k]) row.setAttribute('data-on', '');
  });
  return travel;
}

// A clock that runs only while `running()` says so, calling `frame` with the
// seconds run so far. A long gap between two frames (a tab left in the
// background) counts as one ordinary frame.
export function clock(frame: (seconds: number) => void, running: () => boolean) {
  let id = 0;
  let before = 0;
  let run = 0;
  const tick = (now: number) => {
    id = 0;
    if (before) {
      const gap = (now - before) / 1000;
      run += gap > 0.5 ? 0.033 : gap;
    }
    before = now;
    frame(run);
    if (running()) id = window.requestAnimationFrame(tick);
    else before = 0;
  };
  return {
    start() {
      if (!id) id = window.requestAnimationFrame(tick);
    },
    stop() {
      if (id) window.cancelAnimationFrame(id);
      id = 0;
      before = 0;
    },
    reset() {
      run = 0;
      before = 0;
    },
  };
}
