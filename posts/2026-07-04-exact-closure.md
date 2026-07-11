---
title: Your grid is a filter
date: 2026-07-04
description: >-
  An interactive tour of exact expressions for the unresolved stress in
  finite-volume LES: the grid is a filter, and the classic subgrid stress is
  the wrong modeling target.
work: exactClosure
---

<script setup>
import ThreePathsMap from '../.vitepress/theme/components/ThreePathsMap.vue'
import ProjectionPlayground from '../.vitepress/theme/components/ProjectionPlayground.vue'
import RstLadder from '../.vitepress/theme/components/RstLadder.vue'
</script>

# Your grid is a filter

**An interactive companion to our paper:**

<PublicationList work="exactClosure" />

The subgrid stress

$$
\xi^\Delta_{ij}(u) = \overline{u_i u_j}^\Delta - \bar{u}^\Delta_i \bar{u}^\Delta_j
$$

might be the most-modeled object in computational physics. Sixty years of
closure models — Smagorinsky, dynamic, scale-similarity, and lately a wave of
neural networks — all aim at it. The paper's claim, stated bluntly: for any
simulation you can actually afford to run, this is the wrong target. There
*is* an exact expression for what a coarse simulation leaves unresolved, we
can write it down, and it looks noticeably different — it knows your numerical
scheme, it is not symmetric, and it is not even local. This post is the tour
of how that happens, with the paper's wall of equations replaced by things you
can click.

## The finite volume method never made an error

Everything starts from an identity that deserves to be more famous. Take the
top-hat filter of width $h$, $\bar{u}^h(x) = \frac{1}{h} \int_{x-h/2}^{x+h/2}
u(y) \, \mathrm{d}y$, and a finite difference over the same $h$:

$$
\partial^h_x u(x) = \frac{u(x + h/2) - u(x - h/2)}{h} = \partial_x \bar{u}^h(x).
$$

This is not an approximation — both sides are the *same number*, exactly (it
is the fundamental theorem of calculus wearing a hat). A coarse finite
difference of the true field equals the true derivative of a filtered field. I
call this the **filter-swap property**, and it means the grid is not where
accuracy goes to die: the grid *is a filter*, and it tells you exactly which
smoothed field your discrete operators are talking about.

Push a conservation law $\partial_t u + \partial_x r(u) = 0$ through this
identity and you get

$$
\partial_t \bar{u}^h + \partial^h_x \, r(u) = 0,
$$

which is the finite volume method — flux difference across a cell, no
approximation anywhere. The FVM is *derived* by filtering, not by truncating
Taylor series. The only sin committed so far is that the flux $r(u)$ still
involves the unfiltered field $u$, which the coarse grid does not carry. All
the error in a coarse simulation enters in one single place: when you replace
that unclosed flux by something computable. Which raises the question of
*when* in the pipeline you commit that sin.

## Two routes to a runnable simulation

Classical LES filters the continuous equations, models the subgrid stress
*while everything is still continuous*, and only then discretizes — a second
approximation, applied on top of a closure that never knew a grid existed.
The paper's route applies two filters instead: the LES filter $f^\Delta$ picks
the physics you want to keep, and the grid filter $f^h$ makes the equation
discrete — both steps exact. Click around:

<ThreePathsMap />

The routes end at equations of identical shape, but they are not the same
equation. On the discretize-first route, the single approximation step has a
well-defined, exact target: the **residual flux**

$$
\tau^{\Delta,h}(u) = \overline{r(u)}^\Delta - r^h\!\left(\bar{u}^{\Delta,h}\right).
$$

Look closely at the second term: it contains $r^h$, the *numerical* flux —
your actual scheme, interpolations, central differences and all. The
discretization error is not floating around outside the closure problem; it is
a term **inside the stress**, where a closure model can finally see it. If
your scheme is dissipative (upwind), $\tau^{\Delta,h}$ automatically asks the
closure for *less* dissipation; if it is a crisp central scheme, it asks for
more. Implicit and explicit LES stop being different philosophies and become
different values in the same expression.

Does it hold up? The paper runs the brutal test: a 13 500-cell Burgers DNS
computes $\tau^{\Delta,h}(u)$ at every time step and injects it into a
300-cell coarse simulation, over 1000 random initial conditions. With the
classical stress as the injected "closure", the coarse run drifts to **7%
error** (at $\Delta = 4h$; 16% in the implicit-LES limit). With
$\tau^{\Delta,h}$: error at **machine precision**, every grid, every filter
width. Not small — zero. It is the closure problem's rarest commodity: a
ground truth.

## How much of your "turbulence" is actually your grid?

Splitting $\tau^{\Delta,h}$ into the classical part plus the two
discretization parts (numerical flux and discrete divergence) tells you how
big the blind spot of a classical closure is. The answer depends entirely on
the ratio of filter width to grid spacing:

<div class="xcl-zones">
  <div class="xcl-zone">
    <div class="xcl-zone-bar"><div class="xcl-zone-grid" style="height: 72%"><span>72%</span></div></div>
    <div class="xcl-zone-name">Δ = 0 <em>implicit LES: the grid is the only filter</em></div>
  </div>
  <div class="xcl-zone">
    <div class="xcl-zone-bar"><div class="xcl-zone-grid" style="height: 25%"><span>~25%</span></div></div>
    <div class="xcl-zone-name">Δ = 4h <em>the upper edge of common practice</em></div>
  </div>
  <div class="xcl-zone">
    <div class="xcl-zone-bar"><div class="xcl-zone-grid" style="height: 2%"><span>&lt;1%</span></div></div>
    <div class="xcl-zone-name">Δ = 32h <em>explicit LES: textbook theory applies</em></div>
  </div>
  <div class="xcl-zones-caption">Share of the residual flux that is discretization error rather than classical subgrid stress (Burgers ensemble, central scheme). Common practice lives at 0 ≤ Δ/h ≤ 4 — the left two bars.</div>
</div>

At $\Delta = 32h$ the classical theory is vindicated — and nobody runs there,
because it wastes a factor 32 of resolution. Where simulations actually live,
between $\Delta = 0$ and $4h$, **a quarter to nearly three quarters of the
thing you are modeling is your own discretization**. The classical framework
handles this with folklore ("let the filter width absorb the grid effects");
the exact expression just accounts for it.

## Then 3D happens: pressure is geometry

Burgers is a warm-up; the incompressible Navier–Stokes equations bring a
constraint: $\nabla \cdot u = 0$. The pressure is not really physics here — it
is a Lagrange multiplier, and the cleanest way to see it is geometric. Think
of every velocity field as a point in a huge vector space. The
divergence-free fields form a subspace — in this cartoon, a line. The
pressure gradient is precisely the correction that moves your field onto that
subspace, orthogonally. Drag the field around:

<ProjectionPlayground />

The paper uses this projection $\pi$ (and a cousin that acts on stress
tensors) to eliminate the pressure entirely and write Navier–Stokes as a
self-contained conservation law for the velocity — which is what lets the
whole filter-swap machinery from 1D go through. But the projection charges a
price: computing it means solving a Poisson equation, so it couples every
point in the domain to every other point. And on the coarse grid, the
filtered field is *not* discretely divergence-free, so it must be re-projected
with the discrete projector, which is baked into the exact stress. The
consequence is worth italics: **the exact unresolved stress is non-local in
the velocity field.** A closure model that looks only at its own grid
neighborhood cannot represent it, no matter how many parameters it has.

## The exact stress is not even symmetric

The second 3D surprise comes from the filter-swap identity itself. In 3D the
grid filter splits into face averages: swapping $\partial_j$ for the discrete
difference $\partial^h_j$ forces the stress component $\xi_{ij}$ to be
averaged over the cell face *orthogonal to direction $j$*:

<div class="xcl-sym">
  <figure class="xcl-sym-fig">
    <svg viewBox="0 0 190 185" role="img" aria-label="A grid cell with its top face highlighted">
      <rect x="40" y="30" width="115" height="115" class="xcl-sym-cell" />
      <line x1="40" y1="30" x2="155" y2="30" class="xcl-sym-face" />
      <text x="97" y="20" text-anchor="middle" class="xcl-sym-facelabel">face ⊥ x₂</text>
      <text x="97" y="95" text-anchor="middle" class="xcl-sym-xi">ξ₁₂</text>
      <line x1="40" y1="168" x2="75" y2="168" class="xcl-sym-axis" />
      <text x="82" y="172" class="xcl-sym-axislabel">x₁</text>
      <line x1="24" y1="145" x2="24" y2="110" class="xcl-sym-axis" />
      <text x="18" y="100" class="xcl-sym-axislabel">x₂</text>
    </svg>
    <figcaption>ξ₁₂: averaged over a <em>horizontal</em> face</figcaption>
  </figure>
  <figure class="xcl-sym-fig">
    <svg viewBox="0 0 190 185" role="img" aria-label="A grid cell with its right face highlighted">
      <rect x="40" y="30" width="115" height="115" class="xcl-sym-cell" />
      <line x1="155" y1="30" x2="155" y2="145" class="xcl-sym-face" />
      <text x="172" y="87" text-anchor="middle" transform="rotate(90 172 87)" class="xcl-sym-facelabel">face ⊥ x₁</text>
      <text x="97" y="95" text-anchor="middle" class="xcl-sym-xi">ξ₂₁</text>
      <line x1="40" y1="168" x2="75" y2="168" class="xcl-sym-axis" />
      <text x="82" y="172" class="xcl-sym-axislabel">x₁</text>
      <line x1="24" y1="145" x2="24" y2="110" class="xcl-sym-axis" />
      <text x="18" y="100" class="xcl-sym-axislabel">x₂</text>
    </svg>
    <figcaption>ξ₂₁: same physics, <em>different</em> face</figcaption>
  </figure>
</div>

Same underlying stress, averaged over two different surfaces: $\xi_{12} \neq
\xi_{21}$. The exact unresolved stress in a finite-volume LES is
**non-symmetric** — it has nine independent components, not six. Meanwhile,
essentially every structural closure model in existence is built symmetric,
because the continuous theory said so. Symmetric models are not approximating
the exact target imperfectly; they are confined to a subspace that provably
does not contain it.

## The ladder to machine precision

Talk is cheap; the 3D experiment is not. A $500^3$ decaying-turbulence DNS
runs alongside a $100^3$ coarse simulation, and the DNS computes the
"closure" term injected into the coarse run — using five candidate stress
expressions, from the textbook one to the paper's exact one. Each rung of the
ladder adds one ingredient from this post:

<RstLadder />

Two readings of this chart. Pessimistic: even with *full DNS data in hand*,
the textbook stress expression cannot steer a coarse simulation better than
21% error — the target itself is off. Optimistic: the gap between 2.86% and
zero is the non-symmetric part, the gap between 6.42% and 2.86% is the
filter-swap face-averaging, and the jump from 21.2% to 6.42% is simply
admitting your numerical scheme into the stress. Every ingredient is
identifiable, and the ladder bottoms out at *exactly* zero.

## Fine, but I can't run a DNS next to my LES

True — DNS-aided LES only certifies the target; it is not a model. The
practical payoff is what happens when you fit an actual closure *to the right
target*. The paper redoes the humble Smagorinsky model, fitting its one
coefficient by least squares against either the classical stress or the exact
one. Fitted to the exact stress, the coefficient comes out consistently
larger — it inherits the extra dissipation that the discretization demands —
and the resulting simulations have lower errors and cleaner spectra, most
visibly in the implicit-LES regime where discretization effects dominate.
That is the cheapest possible model gaining accuracy purely from better
target data. For data-driven closures with thousands of parameters, trained
directly on residual data, the choice of target is the whole game — that was
the lesson of
[our earlier JCP paper](https://doi.org/10.1016/j.jcp.2024.113577), and the
present paper supplies the exact target it called for.

## What I want you to remember

- **The grid is a filter, and the FVM is exact.** Discretization error is not
  a separate tax on top of the closure problem — written correctly, it is a
  term inside the unresolved stress.
- **The exact target exists.** Feed it back and a coarse turbulence
  simulation tracks the filtered DNS to machine precision, in 1D and 3D.
- **It is non-symmetric and non-local.** The symmetric, local closures we
  have been building for sixty years cannot reach it even in principle — at
  best they reach the 2.86% rung of the ladder.

One more confession is still owed. This whole story treats space as guilty
and time as innocent: the equations above are discrete in $x$ and blissfully
continuous in $t$. But nobody integrates ODEs exactly either — and the time
step, it turns out, is *also* a filter. That, however, is a story for another
paper.

---

*All numbers in this post are from the
[paper](https://doi.org/10.1016/j.jcp.2026.114810): the Burgers ensemble
(13 500-cell DNS, 1000 initial conditions, central scheme) and the 3D
decaying-turbulence experiment (500³ DNS onto a 100³ grid, Gaussian filter of
width Δ = 2h). Everything is reproducible with
[ExactClosure.jl](https://github.com/agdestein/ExactClosure.jl).*

<style>
.xcl-zones {
  --xcl-grid: #c98500;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1rem;
}
html.dark .xcl-zones {
  --xcl-grid: #eda100;
}
.xcl-zone-bar {
  position: relative;
  height: 130px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--vp-c-text-3) 14%, transparent);
  overflow: hidden;
}
.xcl-zone-grid {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--xcl-grid);
  border-radius: 0 0 6px 6px;
}
.xcl-zone-grid span {
  position: absolute;
  top: -1.4em;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.xcl-zone-name {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: center;
  line-height: 1.4;
}
.xcl-zone-name em {
  display: block;
  font-weight: 400;
  font-style: normal;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}
.xcl-zones-caption {
  grid-column: 1 / -1;
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.xcl-sym {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 1.5rem 0;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1rem;
}
.xcl-sym-fig {
  flex: 1 1 180px;
  max-width: 240px;
  margin: 0;
  text-align: center;
}
.xcl-sym-fig svg {
  width: 100%;
  height: auto;
}
.xcl-sym-fig figcaption {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  margin-top: 0.25rem;
}
.xcl-sym-cell {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 1.5;
}
.xcl-sym-face {
  stroke: var(--vp-c-brand-1);
  stroke-width: 6;
  stroke-linecap: round;
}
.xcl-sym-facelabel {
  font-size: 12px;
  font-weight: 600;
  fill: var(--vp-c-brand-1);
}
.xcl-sym-xi {
  font-size: 20px;
  font-weight: 700;
  fill: var(--vp-c-text-1);
}
.xcl-sym-axis {
  stroke: var(--vp-c-text-3);
  stroke-width: 1.5;
  marker-end: none;
}
.xcl-sym-axislabel {
  font-size: 11px;
  fill: var(--vp-c-text-3);
}
@media (max-width: 560px) {
  .xcl-zones {
    grid-template-columns: 1fr;
  }
  .xcl-zone-bar {
    height: 80px;
  }
}
</style>
