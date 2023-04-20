# This file was generated, do not modify it.

using Random

Random.seed!(0)

n = 5
A = randn(n, n)
f(x) = A * x

σ(x) = max(0, x)
NN(x, (; B₁, B₂, B₃, b₁, b₂, b₃)) = B₃ * σ.(B₂ * σ.(B₁ * x .+ b₁) .+ b₂) .+ b₃

using ComponentArrays
θ₀ = ComponentArray(;
    B₁ = randn(n, n),
    B₂ = randn(n, n),
    B₃ = randn(n, n),
    b₁ = randn(n),
    b₂ = randn(n),
    b₃ = randn(n),
);

using LinearAlgebra

L(x, θ) = sum(abs2, NN(x, θ) - f(x))
L(θ) = L(randn(n), θ)

xvalid = randn(n)
apriori_error(θ) = norm(NN(xvalid, θ) - f(xvalid)) / norm(f(xvalid))
apriori_error(θ₀)

using Zygote

function train(θ; niter = 5_000, η = 0.001, batch_size = 20)
    e = [apriori_error(θ)]
    for i = 1:niter
        g = sum(first(gradient(L, θ)) for _ = 1:batch_size) / batch_size
        θ = θ - η * g
        push!(e, apriori_error(θ))
    end
    θ, e
end

θ, e = train(θ₀);

using Plots
plot(e; label = false, title = "A priori error")

savefig(joinpath(@OUTPUT, "errors.png")); #hide

apriori_error(θ)

x = randn(n)
y = randn(n)
additivity_error = norm(NN(x + y, θ) - NN(x, θ) - NN(y, θ)) / norm(NN(x, θ) + NN(y, θ))

x = randn(n)
homogeneity_error(λ) = norm(NN(λ * x, θ) - λ * NN(x, θ)) / norm(λ * NN(x, θ))
plot(
    LinRange(-10, 10, 100),
    homogeneity_error;
    xlabel = "λ",
    title = "Relative homogeneity error",
    label = false,
)
savefig(joinpath(@OUTPUT, "homogeneity.png")); #hide

