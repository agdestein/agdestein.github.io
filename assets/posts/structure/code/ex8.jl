# This file was generated, do not modify it. # hide
x = randn(n)
homogeneity_error(λ) = norm(NN(λ * x, θ) - λ * NN(x, θ)) / norm(λ * NN(x, θ))
plot(
    LinRange(-10, 10, 100),
    homogeneity_error;
    xlabel = "λ",
    title = "Relative homogeneity error",
    label = false,
)
savefig(joinpath(@OUTPUT, "homogeneity.png")); # hide