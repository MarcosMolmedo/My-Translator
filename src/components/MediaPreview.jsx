import "../Styles/MediaPreview.css";

const MediaPreview = ({ translations }) => {
  const media = translations.mediaPreview;

  return (
    <section className="media-preview" aria-labelledby="media-preview-title">
      <div className="media-preview__container">
        <div className="media-preview__header">
          <div>
            <h2 className="media-preview__title" id="media-preview-title">
              {media.title}
            </h2>

            <p className="media-preview__intro">{media.intro}</p>
          </div>

          <a className="media-preview__view-all" href={media.viewAllUrl}>
            {media.viewAll}
          </a>
        </div>

        <div className="media-preview__grid">
          {media.items.map((item) => (
            <article className="media-preview__card" key={item.title}>
              <div className="media-preview__brand">
                <img
                  className="media-preview__logo"
                  src={item.logo}
                  alt={item.logoAlt}
                  loading="lazy"
                />

                <div className="media-preview__brand-text">
                  <h3 className="media-preview__card-title">{item.title}</h3>
                  <span className="media-preview__category">
                    {item.category}
                  </span>
                </div>
              </div>

              <p className="media-preview__text">{item.text}</p>

              <a
                className="media-preview__button"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel}
              >
                {item.button}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaPreview;