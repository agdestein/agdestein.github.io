# This file was generated, do not modify it. # hide
using Random

Random.seed!(0)

n = 5
A = randn(n, n)
f(x) = A * x

σ(x) = max(0, x)
NN(x, (; B₁, B₂, B₃, b₁, b₂, b₃)) = B₃ * σ.(B₂ * σ.(B₁ * x .+ b₁) .+ b₂) .+ b₃