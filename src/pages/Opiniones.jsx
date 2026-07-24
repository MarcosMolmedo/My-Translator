import React, { useEffect, useState } from "react";
import "../Styles/Opiniones.css";
import personaIcon from "../assets/images/iconoopiniones.png";

const GOOGLE_REVIEWS_URL =
  "https://europe-west1-my-translator-8c7e0.cloudfunctions.net/getGoogleReviews";

const GOOGLE_REVIEWS_FALLBACK_URL =
  "https://www.google.com/maps/search/?api=1&query=MY+Translator+Utrecht";

const replaceValue = (text, value) =>
  text.replace("{value}", String(value));

const formatReviewDate = (publishTime, text) => {
  if (!publishTime) {
    return "";
  }

  const publishDate = new Date(publishTime);

  if (Number.isNaN(publishDate.getTime())) {
    return "";
  }

  const now = new Date();
  const millisecondsDifference = now.getTime() - publishDate.getTime();
  const daysDifference = Math.max(
    0,
    Math.floor(millisecondsDifference / (1000 * 60 * 60 * 24))
  );

  if (daysDifference === 0) {
    return text.today;
  }

  if (daysDifference === 1) {
    return text.yesterday;
  }

  if (daysDifference < 7) {
    return replaceValue(text.daysAgo, daysDifference);
  }

  if (daysDifference < 14) {
    return text.oneWeekAgo;
  }

  if (daysDifference < 30) {
    return replaceValue(
      text.weeksAgo,
      Math.floor(daysDifference / 7)
    );
  }

  if (daysDifference < 60) {
    return text.oneMonthAgo;
  }

  if (daysDifference < 365) {
    return replaceValue(
      text.monthsAgo,
      Math.floor(daysDifference / 30)
    );
  }

  if (daysDifference < 730) {
    return text.oneYearAgo;
  }

  return replaceValue(
    text.yearsAgo,
    Math.floor(daysDifference / 365)
  );
};

const renderStars = (rating = 5) => {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));

  return Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={
        index < safeRating
          ? "opiniones__star opiniones__star--active"
          : "opiniones__star opiniones__star--inactive"
      }
      aria-hidden="true"
    >
      ★
    </span>
  ));
};

const ReviewSkeleton = ({ index }) => (
  <article
    className="opiniones__card opiniones__card--skeleton"
    aria-hidden="true"
    key={index}
  >
    <div className="opiniones__card-top">
      <div className="opiniones__skeleton-avatar" />

      <div className="opiniones__skeleton-header">
        <div className="opiniones__skeleton-line opiniones__skeleton-line--name" />
        <div className="opiniones__skeleton-line opiniones__skeleton-line--date" />
      </div>
    </div>

    <div className="opiniones__skeleton-stars" />

    <div className="opiniones__skeleton-body">
      <div className="opiniones__skeleton-line opiniones__skeleton-line--full" />
      <div className="opiniones__skeleton-line opiniones__skeleton-line--full" />
      <div className="opiniones__skeleton-line opiniones__skeleton-line--medium" />
      <div className="opiniones__skeleton-line opiniones__skeleton-line--short" />
    </div>
  </article>
);

const Opiniones = ({ translations }) => {
console.log("translations:", translations);

const opiniones = translations?.opiniones;

  const [reviewsData, setReviewsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);


  useEffect(() => {
    const controller = new AbortController();

    const loadGoogleReviews = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetch(GOOGLE_REVIEWS_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `No se pudieron cargar las opiniones: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data?.ok || !Array.isArray(data?.reviews)) {
          throw new Error("La respuesta de Google Reviews no es válida.");
        }

        setReviewsData(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error al cargar Google Reviews:", error);
          setHasError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadGoogleReviews();

    return () => {
      controller.abort();
    };
  }, []);

  const reviews = reviewsData?.reviews || [];
  const rating = Number(reviewsData?.rating || 0);
  const totalReviews = Number(reviewsData?.totalOpiniones || 0);

  const googleMapsUrl =
    reviewsData?.googleMapsUrl || GOOGLE_REVIEWS_FALLBACK_URL;

  const reviewCountText =
    totalReviews === 1
      ? opiniones.reviewSingular
      : opiniones.reviewPlural;

  return (
    <main className="opiniones">
      <section
        className="opiniones__hero"
        aria-labelledby="opiniones-title"
      >
        <div className="opiniones__container">
          <div className="opiniones__intro">
            <div className="opiniones__intro-content">
              <p className="opiniones__eyebrow">{opiniones.eyebrow}</p>

              <h1
                id="opiniones-title"
                className="opiniones__title"
              >
                {opiniones.title}
              </h1>

              <p className="opiniones__description">
                {opiniones.intro}
              </p>
            </div>

            {!hasError && (
              <div
                className="opiniones__summary"
                aria-live="polite"
              >
                {isLoading ? (
                  <div
                    className="opiniones__summary-skeleton"
                    aria-label={opiniones.loadingLabel}
                  >
                    <div className="opiniones__summary-skeleton-rating" />
                    <div className="opiniones__summary-skeleton-stars" />
                    <div className="opiniones__summary-skeleton-text" />
                  </div>
                ) : (
                  <>
                   <div className="opiniones__rating">
                   <span
                    className="opiniones__google-logo"
                    aria-hidden="true"
                   />

                  <strong className="opiniones__rating-number">
                   {rating.toFixed(1)}
                  </strong>

                  <span className="opiniones__rating-label">
                  {opiniones.ratingLabel}
                  </span>
                  </div>
                  
                    <div
                      className="opiniones__stars"
                      aria-label={`${rating.toFixed(1)} ${opiniones.starsLabel}`}
                    >
                      {renderStars(rating)}
                    </div>

                    <p className="opiniones__count">
                      {opiniones.basedOn}{" "}
                      <strong>{totalReviews}</strong>{" "}
                      {reviewCountText}
                    </p>

                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opiniones__google-link"
                    >
                      <span>{opiniones.viewAll}</span>
                      <span
                        className="opiniones__google-link-arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        className="opiniones__reviews"
        aria-label={opiniones.eyebrow}
      >
        <div className="opiniones__container">
          {isLoading && (
            <>
              <p className="opiniones__sr-only" aria-live="polite">
                {opiniones.loadingLabel}
              </p>

              <div className="opiniones__grid">
                {Array.from({ length: 6 }, (_, index) => (
                  <ReviewSkeleton key={index} index={index} />
                ))}
              </div>
            </>
          )}

          {!isLoading && hasError && (
            <div
              className="opiniones__error"
              role="status"
            >
              <div
                className="opiniones__error-icon"
                aria-hidden="true"
              >
                ★
              </div>

              <h2 className="opiniones__error-title">
                {opiniones.errorTitle}
              </h2>

              <p className="opiniones__error-text">
                {opiniones.errorText}
              </p>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="opiniones__error-button"
              >
                {opiniones.errorButton}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          )}

      {!isLoading && !hasError && reviews.length > 0 && (
  <div className="opiniones__grid">
    {reviews.slice(0, 5).map((review, index) => {
      const reviewerName =
        review.nombre?.trim() || opiniones.anonymous;

      const formattedDate = formatReviewDate(
        review.fechaPublicacion,
        opiniones
      );

      return (
        <article
          key={`${reviewerName}-${review.fechaPublicacion || index}`}
          className="opiniones__card"
          aria-label={`${opiniones.reviewBy} ${reviewerName}`}
        >
          <div className="opiniones__card-top">
            <div
              className="opiniones__avatar"
              aria-hidden="true"
            >
              <img
                src={personaIcon}
                alt=""
                className="opiniones__avatar-icon"
              />
            </div>

            <header className="opiniones__header">
              <h2 className="opiniones__name">
                {reviewerName}
              </h2>

              <p className="opiniones__meta">
                <span className="opiniones__verified">
                  {opiniones.verified}
                </span>

                {formattedDate && (
                  <>
                    <span
                      className="opiniones__meta-separator"
                      aria-hidden="true"
                    >
                      ·
                    </span>

                    <time
                      className="opiniones__date"
                      dateTime={
                        review.fechaPublicacion || undefined
                      }
                    >
                      {formattedDate}
                    </time>
                  </>
                )}
              </p>
            </header>
          </div>

          <div
            className="opiniones__card-stars"
            aria-label={`${review.estrellas || 5} ${
              opiniones.starsLabel
            }`}
          >
            {renderStars(review.estrellas || 5)}
          </div>

          <blockquote className="opiniones__quote">
            <p className="opiniones__text">
              {review.texto}
            </p>
          </blockquote>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="opiniones__profile-link"
            aria-label={`${opiniones.openReview} ${reviewerName}`}
          >
            {opiniones.viewReview}
            <span aria-hidden="true">↗</span>
          </a>
        </article>
      );
    })}

    <article
      className="opiniones__card opiniones__card--cta"
      aria-label={opiniones.ctaTitle}
    >
      <div
        className="opiniones__cta-icon"
        aria-hidden="true"
      >
        ⭐
      </div>

      <h2 className="opiniones__cta-title">
        {opiniones.ctaTitle}
      </h2>

      <p className="opiniones__cta-text">
        {replaceValue(
          opiniones.ctaText,
          totalReviews
        )}
      </p>

      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="opiniones__cta-link"
      >
        {opiniones.ctaButton}
        <span aria-hidden="true">→</span>
      </a>
    </article>
  </div>
)}
        </div>
      </section>
    </main>
  );
};

export default Opiniones;