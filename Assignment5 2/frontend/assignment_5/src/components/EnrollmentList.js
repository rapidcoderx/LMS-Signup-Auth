import React from 'react';

const EnrollmentList = ({ enrolledCourses = [], onRemove }) => {
  const totalCredits = enrolledCourses.reduce((sum, course) => {
    const weeks = parseInt(course.duration.match(/\d+/)?.[0] || 0);
    return sum + weeks;
  }, 0);

  return (
    <div style={{
      flex: 1,
      maxWidth: '350px',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#004080', marginBottom: '20px' }}>My Enrollments</h2>
      
      {enrolledCourses.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center' }}>
          No courses enrolled yet
        </p>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            {enrolledCourses.map(course => (
              <div 
                key={course.enrollmentId}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '15px'
                }}
              >
                <h4 style={{ margin: '0 0 10px', color: '#003366' }}>
                  {course.name}
                </h4>
                <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                  Instructor: {course.instructor}
                </p>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.9em' }}>{course.duration}</span>
                  <button
                    onClick={() => onRemove(course)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      ':hover': {
                        backgroundColor: '#c82333'
                      }
                    }}
                  >
                    Drop
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            borderTop: '2px solid #004080',
            paddingTop: '15px'
          }}>
            <h3 style={{ color: '#004080' }}>
              Total Study Load: {totalCredits} weeks
            </h3>
          </div>
        </>
      )}
    </div>
  );
};

export default EnrollmentList;
