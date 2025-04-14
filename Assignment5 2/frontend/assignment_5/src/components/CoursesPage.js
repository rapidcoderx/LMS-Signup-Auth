import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CourseItem from './CourseItem';
import EnrollmentList from './EnrollmentList';

const CoursesPage = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    // Fetch enrolled courses
    fetch(`http://127.0.0.1:5000/student_courses/${studentId}`)
      .then(res => res.json())
      .then(setEnrolledCourses)
      .catch(err => console.error('Could not load enrolled courses:', err));

    // Fetch all available courses
    fetch('http://127.0.0.1:5000/courses')
      .then(res => res.json())
      .then(setAllCourses)
      .catch(err => console.error('Could not load courses:', err));
  }, [studentId]);

  const handleEnroll = (course) => {
    fetch(`http://127.0.0.1:5000/enroll/${studentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEnrolledCourses(prev => [...prev, course]);
        } else {
          alert(data.message || 'Enrollment failed.');
        }
      })
      .catch(() => alert('Could not enroll in course.'));
  };

  const handleRemove = (course) => {
    fetch(`http://127.0.0.1:5000/drop/${studentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course) // ✅ now sending the actual course
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEnrolledCourses(prev => prev.filter(c => c.id !== course.id));
        } else {
          alert(data.message || 'Failed to drop course.');
        }
      })
      .catch(() => alert('Could not drop course.'));
  };
  

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ flex: 1, display: 'flex', padding: '20px', gap: '30px' }}>
        <div style={{ flex: 3 }}>
          <h2 style={{ color: '#004080' }}>Available Courses</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {allCourses.map(course => (
              <CourseItem 
                key={course.id} 
                course={course} 
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        </div>

        <EnrollmentList 
          enrolledCourses={enrolledCourses}
          onRemove={(course) => handleRemove(course)}
        />
      </div>

      <Footer />
    </div>
  );
};

export default CoursesPage;
