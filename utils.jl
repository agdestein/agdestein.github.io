using Dates

"""
    {{blogposts}}

Plug in the list of blog posts contained in the `/posts` folder.
Souce:
<https://github.com/abhishalya/abhishalya.github.io> via
<https://gitlab.com/rikh/blog/-/blob/main/utils.jl> via
"""
@delay function hfun_blogposts()
    today = Dates.today()
    curyear = year(today)
    curmonth = month(today)
    curday = day(today)

    list = readdir("posts")
    filter!(endswith(".md"), list)
    function sorter(p)
        ps  = splitext(p)[1]
        url = "/posts/$ps/"
        surl = strip(url, '/')
        pubdate = pagevar(surl, "published")
        if isnothing(pubdate)
            return Date(Dates.unix2datetime(stat(surl * ".md").ctime))
        end
        return Date(pubdate, dateformat"yyyy-mm-dd")
    end
    sort!(list, by=sorter, rev=true)

    io = IOBuffer()
    write(io, """<ul class="blog-posts">""")
    for (i, post) in enumerate(list)
        if post == "index.md"
            continue
        end
        ps = splitext(post)[1]
        write(io, "<li><span><i>")
        url = "/posts/$ps/"
        surl = strip(url, '/')
        title = pagevar(surl, "title")
        pubdate = pagevar(surl, "published")
        description = pagevar(surl, "rss_description")
        if isnothing(pubdate)
            date = "$curyear-$curmonth-$curday"
        else
            date = Date(pubdate, dateformat"yyyy-mm-dd")
        end
        write(io, """$date</i></span><b><a href="$url">$title</a></b>""")
        write(io, """<li><i class="description">$description</i></li>""")
    end
    write(io, "</ul>")
    return String(take!(io))
end
