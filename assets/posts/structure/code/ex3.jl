# This file was generated, do not modify it. # hide
using LinearAlgebra

L(x, θ) = sum(abs2, NN(x, θ) - f(x))
L(θ) = L(randn(n), θ)

xvalid = randn(n)
apriori_error(θ) = norm(NN(xvalid, θ) - f(xvalid)) / norm(f(xvalid))
apriori_error(θ₀)