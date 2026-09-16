import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  ArrowRight,
  Car,
  UserCheck,
  Shield,
  MapPin,
  CalendarDays,
  Search,
} from 'lucide-react';

import hero1 from '../assets/hero/car-rental-1.png';
import hero2 from '../assets/hero/car-rental-2.png';

import './Home.css';

const slides = [
  {
    id: 1,
    kicker: 'CAR RENTAL IN NEPAL',
    title: "Drive Nepal's roads",
    highlight: 'your way.',
    description:
      'Reliable vehicles for city drives, weekend escapes and journeys across Nepal.',
    primary: 'Find a Car',
    primaryLink: '#booking',
    secondary: 'Explore Services',
    secondaryLink: '#services',
    image: hero1,
  },

  {
    id: 2,
    kicker: 'TRAVEL ACROSS NEPAL',
    title: 'From city streets to',
    highlight: 'mountain roads.',
    description:
      'Choose the right vehicle for Kathmandu, Pokhara, Chitwan and journeys beyond.',
    primary: 'Find a Car',
    primaryLink: '#booking',
    secondary: 'Hire a Driver',
    secondaryLink: '/hire-driver',
    image: hero2,
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((current) => (current + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <main className="home-page">

      {/* ================= HERO ================= */}

      <section className="home-hero">

        {/* Sliding images */}
        <div className="hero-images">
          {slides.map((item, index) => (
            <div
              key={item.id}
              className={`hero-image ${
                index === currentSlide ? 'active' : ''
              }`}
              style={{
                backgroundImage: `url(${item.image})`,
              }}
            />
          ))}
        </div>

        {/* Dark overlay */}
        <div className="hero-overlay"></div>

        <div className="wrap home-hero-content">

          <div
            className="hero-copy"
            key={currentSlide}
          >
            <span className="hero-kicker">
              <span></span>
              {slide.kicker}
            </span>

            <h1>
              {slide.title}
              <br />
              <em>{slide.highlight}</em>
            </h1>

            <p>{slide.description}</p>

            <div className="hero-actions">

              {slide.primaryLink.startsWith('/') ? (
                <Link
                  to={slide.primaryLink}
                  className="btn-primary"
                >
                  {slide.primary}
                  <ArrowRight size={17} />
                </Link>
              ) : (
                <a
                  href={slide.primaryLink}
                  className="btn-primary"
                >
                  {slide.primary}
                  <ArrowRight size={17} />
                </a>
              )}

              {slide.secondaryLink.startsWith('/') ? (
                <Link
                  to={slide.secondaryLink}
                  className="btn-ghost"
                >
                  {slide.secondary}
                </Link>
              ) : (
                <a
                  href={slide.secondaryLink}
                  className="btn-ghost"
                >
                  {slide.secondary}
                </a>
              )}

            </div>
          </div>

        </div>


        {/* Slider progress */}
        <div className="hero-dots">

          {slides.map((item, index) => (
            <button
              key={item.id}
              className={index === currentSlide ? 'active' : ''}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Show slide ${index + 1}`}
            >
              <span></span>
            </button>
          ))}

        </div>

      </section>


      {/* ================= BOOKING ================= */}

      <section className="booking-section" id="booking">

        <div className="wrap">

          <div className="booking-card">

            <div className="booking-title">
              <span>BOOK YOUR RIDE</span>
              <strong>Where are you going?</strong>
            </div>

            <div className="booking-field">
              <label>Pick-up location</label>

              <div className="booking-input">
                <MapPin size={18} />

                <input
                  type="text"
                  placeholder="Kathmandu"
                />
              </div>
            </div>

            <div className="booking-field">
              <label>Pick-up date</label>

              <div className="booking-input">
                <CalendarDays size={18} />
                <input type="date" />
              </div>
            </div>

            <div className="booking-field">
              <label>Return date</label>

              <div className="booking-input">
                <CalendarDays size={18} />
                <input type="date" />
              </div>
            </div>

            <button className="booking-search-btn">
              <Search size={18} />
              Search
            </button>

          </div>

        </div>

      </section>


      {/* ================= SERVICES ================= */}

      <section className="home-services" id="services">

        <div className="wrap">

          <div className="section-heading">

            <div>
              <span className="kicker">OUR SERVICES</span>

              <h2>
                One journey.
                <br />
                Different ways to travel.
              </h2>
            </div>

            <p>
              Whether you're driving yourself, travelling with a
              professional driver or managing transportation for your
              company, we've got you covered.
            </p>

          </div>


          <div className="services-grid">

            <article className="service-card">

              <span className="service-number">01</span>

              <div className="service-icon">
                <Car size={27} />
              </div>

              <h3>Car Rentals</h3>

              <p>
                Flexible daily and weekly rentals for city travel,
                family journeys and road trips across Nepal.
              </p>

              <a href="#booking" className="link-arrow">
                Browse cars
                <ArrowRight size={16} />
              </a>

            </article>


            <article className="service-card">

              <span className="service-number">02</span>

              <div className="service-icon">
                <UserCheck size={27} />
              </div>

              <h3>Driver Hire</h3>

              <p>
                Experienced local drivers for airport transfers,
                daily commuting and longer journeys.
              </p>

              <Link
                to="/hire-driver"
                className="link-arrow"
              >
                Hire a driver
                <ArrowRight size={16} />
              </Link>

            </article>


            <article className="service-card">

              <span className="service-number">03</span>

              <div className="service-icon">
                <Shield size={27} />
              </div>

              <h3>Corporate Fleets</h3>

              <p>
                Reliable long-term transportation solutions for
                businesses, teams and organizations.
              </p>

              <Link
                to="/corporate-rent"
                className="link-arrow"
              >
                Corporate rental
                <ArrowRight size={16} />
              </Link>

            </article>

          </div>

        </div>

      </section>

    </main>
  );
}