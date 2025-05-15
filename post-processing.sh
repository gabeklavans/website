# remove repeated footnotes sections https://github.com/markdown-it/markdown-it-footnote/issues/53
sed -i '67,83d' _site/posts/distroless/index.html
sed -i '138,146d' _site/posts/Gamejay/index.html
