import "../Styles/BlogPreview.css";

const BlogPreview = ({ translations }) => {
  const blog = translations.blogPreview;

  return (
    <section className="blog-preview" aria-labelledby="blog-preview-title">
      <div className="blog-preview__container">
        <div className="blog-preview__header">
          <span className="blog-preview__eyebrow">{blog.eyebrow}</span>

          <h2 className="blog-preview__title" id="blog-preview-title">
            {blog.title}
          </h2>

          <p className="blog-preview__intro">{blog.intro}</p>
        </div>

        <div className="blog-preview__categories" aria-label={blog.categoriesLabel}>
          {blog.categories.map((category) => (
            <span className="blog-preview__category" key={category}>
              {category}
            </span>
          ))}
        </div>

        <div className="blog-preview__list">
          {blog.articles.map((article) => (
            <article className="blog-preview__article" key={article.title}>
              <a
                className="blog-preview__image-link"
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={article.ariaLabel}
              >
                <img
                  className="blog-preview__image"
                  src={article.image}
                  alt={article.imageAlt}
                  loading="lazy"
                />
              </a>

              <div className="blog-preview__content">
                <div className="blog-preview__meta">
                  <span>{article.date}</span>
                  <span>{article.category}</span>
                </div>

                <h3 className="blog-preview__article-title">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {article.title}
                  </a>
                </h3>

                <p className="blog-preview__description">
                  {article.description}
                </p>

                <a
                  className="blog-preview__read-more"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={article.ariaLabel}
                >
                  {blog.readMore}
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BlogPreview;