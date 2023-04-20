# This file was generated, do not modify it. # hide
x = randn(n)
y = randn(n)
additivity_error = norm(NN(x + y, θ) - NN(x, θ) - NN(y, θ)) / norm(NN(x, θ) + NN(y, θ))