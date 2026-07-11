---
title: Software
description: >-
  Open-source scientific computing software in Julia: a differentiable,
  GPU-accelerated Navier–Stokes solver, research codes, and tutorials on
  neural closure models.
---

# Software

Most of my research runs on software I build and maintain in the open. If a
paper of mine makes a claim, there is a repository where you can rerun it.

## IncompressibleNavierStokes.jl

[IncompressibleNavierStokes.jl](https://github.com/agdestein/IncompressibleNavierStokes.jl)
is the main package: a differentiable, GPU-accelerated incompressible
Navier–Stokes solver in Julia, designed for large-eddy simulation and
data-driven closure modeling. Being differentiable end-to-end means neural
closure models can be trained *through* the solver ("a-posteriori" training),
not just on precomputed snapshots.

It is described in the paper
[A differentiable software suite for accelerated simulation of turbulent flows](https://doi.org/10.48550/arXiv.2604.18536)
and in the blog post
[Writing a differentiable fluid solver in Julia](/posts/2024-10-06-differentiable-fluid-solver).

## Research codes

Each paper ships with the code that produced it:

- [SymmetryCode.jl](https://github.com/agdestein/SymmetryCode.jl) —
  equivariant closure models and the experiments of the
  [symmetry paper](https://doi.org/10.48550/arXiv.2603.05325)
- [ExactClosure.jl](https://github.com/agdestein/ExactClosure.jl) —
  exact unresolved-stress expressions for finite-volume LES
  ([paper](https://doi.org/10.1016/j.jcp.2026.114810))
- [DLES15CompanionCode](https://github.com/agdestein/DLES15CompanionCode) —
  time integration as filtering
  ([paper](https://doi.org/10.48550/arXiv.2606.17759))
- [DivergenceConsistency](https://github.com/agdestein/DivergenceConsistency) —
  divergence-consistent neural closure models
  ([paper](https://doi.org/10.1016/j.jcp.2024.113577))
- [DiscreteFiltering.jl](https://github.com/agdestein/DiscreteFiltering.jl) —
  discrete filtering in 1D
  ([paper](https://doi.org/10.23967/eccomas.2022.094))

## Tutorials

[NeuralClosureTutorials](https://github.com/agdestein/NeuralClosureTutorials)
contains pedagogical notebooks on learning neural closure models for fluid
flows, used in lectures and schools.

## Contributions

I have contributed to [GEMSEO](https://gemseo.org) (multidisciplinary design
optimization),
[SpinDoctor](https://github.com/SpinDoctorMRI/SpinDoctor) (diffusion-MRI
simulation), and [Artery.FE](https://github.com/KVSlab/bloodflow) (1D
blood-flow simulation in FEniCS,
[JOSS paper](https://doi.org/10.21105/joss.01107)).
