---
layout: page
description: >-
  Syver Døving Agdestein is a postdoctoral researcher in scientific computing
  at CWI Amsterdam, working on probabilistic simulation of turbulence,
  closure models, and differentiable programming in Julia.
---

<div class="home">

<header class="home-masthead">
<div>
<p class="home-eyebrow">Scientific computing · CWI Amsterdam</p>
<h1 class="home-name">Syver Døving Agdestein</h1>
<p class="home-thesis">I study what the filter erases.</p>
</div>
<img class="home-portrait" src="/logo.png" alt="Portrait of Syver Døving Agdestein" />
</header>

<FilterCut />

Turbulent flows cannot be simulated eddy-for-eddy at realistic scales, so we
filter: resolve the large motions, and model the effect of everything the
filter removed. I'm a postdoctoral researcher in the Scientific Computing
group at [CWI](https://www.cwi.nl/) in Amsterdam working on that model — the
*closure* — with a current focus on probabilistic approaches to simulating
turbulence. I did my PhD at Eindhoven University of Technology on data-driven
closure models for large-eddy simulation, treating the numerical
discretization as part of the physics rather than an afterthought.

The papers, talks, and interactive essays here all pull on that one thread,
and the [software](/software) behind them is open: differentiable,
GPU-accelerated solvers in Julia. Away from the keyboard I'm drawn to
history, languages, and the piano — I've lived in Asker, Gembloux, Toulouse,
Saint Petersburg, Paris, and now Amsterdam.

<p class="home-links">
<a href="/works/">research</a>
<a href="/publications">publications</a>
<a href="/talks">talks</a>
<a href="/software">software</a>
<a href="/posts/">blog</a>
<a href="/about">cv</a>
</p>

## Play with the research

Each recent paper ships with an interactive companion — the same ideas, with
the knobs exposed:

- [What symmetry buys a learned turbulence model](/posts/2026-07-06-symmetry)
  — try to break equivariance yourself
- [Your grid is a filter](/posts/2026-07-04-exact-closure)
  — why the most-modeled stress tensor in CFD is the wrong target
- [Your time integrator is a filter](/posts/2026-07-05-time-integration-as-filtering)
  — the largest coarse-simulation error nobody models

## Recent

<NewsList :limit="6" />

</div>
