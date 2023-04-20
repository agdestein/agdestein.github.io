# This file was generated, do not modify it. # hide
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