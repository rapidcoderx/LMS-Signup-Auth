import { useEffect, useState } from 'react';
import courses from '../data/courses';
import testimonials from '../data/testimonials';

const MainSection = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [randomTestimonials, setRandomTestimonials] = useState([]);

  useEffect(() => {
    // Randomize courses and testimonials
    setFeaturedCourses([...courses].sort(() => 0.5 - Math.random()).slice(0, 3));
    setRandomTestimonials([...testimonials].sort(() => 0.5 - Math.random()).slice(0, 2));
  }, []);

  return (
    <main>
      <section className="about">
        <h2>About LMS</h2>
        <p>Manage courses and track progress efficiently.</p>
      </section>

      <section className="featured-courses">
        <h3>Featured Courses</h3>
        {featuredCourses.map(course => (
          <div key={course.id}>
            <img src={course.image} alt={course.name} />
            <h4>{course.name}</h4>
          </div>
        ))}
      </section>

      <section className="testimonials">
        <h3>Student Testimonials</h3>
        {randomTestimonials.map((testimonial, idx) => (
          <div key={idx}>
            <p>{testimonial.studentName}</p>
            <p>{'★'.repeat(testimonial.rating)}</p>
            <p>{testimonial.review}</p>
          </div>
        ))}
      </section>
    </main>
  );
};
